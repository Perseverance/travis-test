import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { Web3Service } from '../../web3/web3.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

export const SETTINGS_TABS = {
	GENERAL: 'GENERAL',
	MY_LISTINGS: 'MY_LISTINGS',
	WALLET: 'WALLET',
	PASSWORD: 'PASSWORD'
};

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, OnDestroy {

	public shouldShowPassword: any;
	public settingsTabs = SETTINGS_TABS;
	public selectedTab = this.settingsTabs.GENERAL;

	private paramsSubscription: Subscription;

	constructor(private authService: AuthenticationService,
		// ,private web3Service: Web3Service
		private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.user === null) {
					this.shouldShowPassword = true;
				} else if (userInfo.user.externalLoginProviders === null) {
					this.shouldShowPassword = true;
				} else {
					this.shouldShowPassword = userInfo.user.externalLoginProviders.length === 0;
				}
			}
		});
		this.paramsSubscription = this.setupParamsWatcher();
		this.listenForWeb3Loaded();
	}

	ngOnDestroy(): void {
		this.paramsSubscription.unsubscribe();
	}

	private setupParamsWatcher() {
		return this.route.queryParams
			.subscribe(params => {
				if (!params.selectedTab || !(params.selectedTab in this.settingsTabs)) {
					return;
				}

				this.selectedTab = params.selectedTab;
			});
	}

	private listenForWeb3Loaded() {
		// this.web3Service.web3InstanceLoaded({
		// 	next: (web3Loaded: boolean) => {
		// 		this.getMetamaskAccounts();
		// 	}
		// });
	}

	// private getMetamaskAccounts() {
	// 	this.web3Service.getMetmaskAccounts().subscribe({
	// 		error: (err) => {
	// 			console.error(err);
	// 		},
	// 		next: (accs) => {
	// 			console.log(accs);
	// 		},
	// 		complete: () => { }
	// 	});
	// }

}
