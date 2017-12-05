import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SmartContractConnectionService, SmartContractAddress } from './../../smart-contract-connection/smart-contract-connection.service';
import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
	selector: 'app-invite-seller',
	templateUrl: './invite-seller.component.html',
	styleUrls: ['./invite-seller.component.scss']
})
export class InviteSellerComponent implements OnInit, OnDestroy {

	public isSellerInvited: boolean;
	public invitationDataLoaded = false;

	private addressSubscription: Subscription;
	private deedAddress: SmartContractAddress;

	constructor(private route: ActivatedRoute, private smartContractConnectionService: SmartContractConnectionService) { }

	async ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedAddress) {
			if (!deedAddress) {
				throw new Error('No deed address supplied');
			}
			self.deedAddress = deedAddress;
			self.isSellerInvited = await self.smartContractConnectionService.isSellerInvited(self.deedAddress);
			self.invitationDataLoaded = true;
		});

	}

	ngOnDestroy() {
		this.addressSubscription.unsubscribe();
	}

}
