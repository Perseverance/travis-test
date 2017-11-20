import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { NextObserver } from 'rxjs/Observer';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Injectable } from '@angular/core';
import { default as Web3 } from 'web3';

@Injectable()
export class Web3Service {

	private web3: Web3;
	private timer: any;
	private retries: number;

	private userDataSubject: ReplaySubject<boolean>;

	constructor() {
		this.userDataSubject = new ReplaySubject(1);
	}

	private get isWeb3Initialized(): boolean {
		return (!!this.web3);
	}

	private setupMetamaskWeb3() {
		if (!(window as any).web3) {
			throw new Error('Not a metamask browser');
		}
		this.web3 = new Web3((window as any).web3.currentProvider);
	}

	public web3InstanceLoaded(observer: NextObserver<boolean>): Subscription {
		if (!this.isWeb3Initialized && !this.timer) {
			this.waitForWeb3();
		}
		return this.userDataSubject.subscribe(observer);
	}

	private waitForWeb3() {
		const RETRY_TIME_MS = 200;
		const MAX_INTERVAL_RETRIES = 10;
		this.retries = 0;
		this.timer = setInterval(() => {
			if (!(window as any).web3) {
				this.retries++;
				if (this.retries < MAX_INTERVAL_RETRIES) {
					return;
				}
				this.userDataSubject.next(false);
				clearInterval(this.timer);
				this.timer = null;
			}
			this.web3 = new Web3((window as any).web3.currentProvider);
			this.userDataSubject.next(true);
			clearInterval(this.timer);
			this.timer = null;
		}, RETRY_TIME_MS);
	}

	public getMetmaskAccounts(): Subject<any[]> {
		if (!this.isWeb3Initialized) {
			throw new Error('Called in illegal state. Web3 was not loaded');
		}
		const accountsSubject = new Subject<any[]>();
		this.web3.eth.getAccounts((err, accs) => {
			if (err != null) {
				console.error(`There was an error fetching your accounts.`);
				accountsSubject.error(err);
				return;
			}

			// Get the initial account balance so it can be displayed.
			if (accs.length == 0) {
				console.error(`Couldn't get any accounts! Make sure your Ethereum client is configured correctly.`);
				accountsSubject.error('Could not get any accounts');
				return;
			}

			accountsSubject.next(accs);
			accountsSubject.complete();
		});
		return accountsSubject;
	}


}
