import { DeedsService } from './../../shared/deeds.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { InvitationStatus } from '../invite/invite.component';

@Component({
	selector: 'app-canceled-deal',
	templateUrl: './canceled-deal.component.html',
	styleUrls: ['./canceled-deal.component.scss']
})
export class CanceledDealComponent implements OnInit {
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
			self.hasDataLoaded = true;
		});
	}

}
