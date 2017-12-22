import { Observable } from 'rxjs/Observable';
import { DeedsService } from './../../shared/deeds.service';
import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Input, EventEmitter, Output, OnDestroy } from '@angular/core';
import { UserRoleEnum } from '../enums/user-role.enum';
import { DeedDocumentType } from '../enums/deed-document-type.enum';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-agree-and-continue',
	templateUrl: './agree-and-continue.component.html',
	styleUrls: ['./agree-and-continue.component.scss']
})
export class AgreeAndContinueComponent implements OnInit, OnDestroy {
	public userRoleEnum = UserRoleEnum;
	public deedDocumentTypeEnum = DeedDocumentType;
	public currentUserRole: number;
	private addressSubscription: Subscription;
	@Input() hasBuyerAgreed: boolean;
	@Input() hasSellerAgreed: boolean;
	@Input() hasBuyerBrokerAgreed: boolean;
	@Input() hasSellerBrokerAgreed: boolean;
	@Input() showAgreeButton: boolean;
	@Input() documentType: any;
	@Output() onSignDocument = new EventEmitter<any>();

	constructor(private route: ActivatedRoute,
		private deedsService: DeedsService) { }

	ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedId) {
			if (!deedId) {
				throw new Error('No deed address supplied');
			}
			const deed = await self.deedsService.getDeedDetails(deedId);
			self.currentUserRole = deed.currentUserRole;
		});
	}

	public onSignDocumentClick() {
		this.onSignDocument.emit();
	}

	ngOnDestroy() {
		this.addressSubscription.unsubscribe();
	}

}
