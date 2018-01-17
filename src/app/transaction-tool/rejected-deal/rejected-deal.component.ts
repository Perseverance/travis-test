import { DeedsService } from './../../shared/deeds.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { InvitationStatus } from '../invite/invite.component';

@Component({
	selector: 'app-rejected-deal',
	templateUrl: './rejected-deal.component.html',
	styleUrls: ['./rejected-deal.component.scss']
})
export class RejectedDealComponent implements OnInit {
	public deedId: string;
	private addressSubscription: Subscription;
	public hasDataLoaded = false;
	public deed: any;
	public rejectionText: string;

	constructor(private route: ActivatedRoute, private deedsService: DeedsService) { }

	ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedId) {
			if (!deedId) {
				throw new Error('No deed address supplied');
			}
			self.deedId = deedId;
			await self.setupRejectionText(deedId);
			self.hasDataLoaded = true;
		});
	}

	private async setupRejectionText(deedId: string) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		this.deed = deed;
		const rejecterRole = this.getRejecterRoleString(deed);
		this.rejectionText = `The ${rejecterRole} has rejected the invitation to this deal`;
		if (deed.rejectionReason) {
			this.rejectionText += ` with reason : '${deed.rejectionReason}'`;
		}
	}

	private getRejecterRoleString(deed: any): string {
		if (deed.buyerBrokerStatus === InvitationStatus.Rejected) {
			return 'Buyer Broker';
		}
		if (deed.buyerStatus === InvitationStatus.Rejected) {
			return 'Buyer';
		}
		if (deed.sellerStatus === InvitationStatus.Rejected) {
			return 'Seller';
		}
		if (deed.titleCompanyStatus === InvitationStatus.Rejected) {
			return 'Title company';
		}
	}

}
