import {Component, EventEmitter, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AuthenticationService, UserData} from '../../authentication/authentication.service';
import {UserRoleEnum} from '../enums/user-role.enum';
import {DeedDocumentType} from '../enums/deed-document-type.enum';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {DeedsService} from '../../shared/deeds.service';

@Component({
	selector: 'app-sign-document',
	templateUrl: './sign-document.component.html',
	styleUrls: ['./sign-document.component.scss']
})
export class SignDocumentComponent implements OnInit, OnDestroy {
	public userRoleEnum = UserRoleEnum;
	public deedDocumentTypeEnum = DeedDocumentType;
	public currentUserRole: number;
	private addressSubscription: Subscription;
	@Input() hasBuyerSigned: boolean;
	@Input() hasSellerSigned: boolean;
	@Input() hasBuyerBrokerSigned: boolean;
	@Input() hasSellerBrokerSigned: boolean;
	@Input() showSignButton: boolean;
	@Input() documentType: any;
	@Output() onSignDocument = new EventEmitter<any>();

	constructor(private route: ActivatedRoute,
				private deedsService: DeedsService) {
	}

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
		console.log(this.documentType);
	}

	public onSignDocumentClick() {
		this.onSignDocument.emit();
	}

	public isSectionWithFourSigners(): boolean {
		if (this.documentType === this.deedDocumentTypeEnum.PurchaseAgreement
			|| this.documentType === this.deedDocumentTypeEnum.SignedSellerDisclosures) {
			return true;
		}
		return false;
	}

	public isSectionWithTwoSigners(): boolean {
		if (this.documentType === this.deedDocumentTypeEnum.TitleReport
			|| this.documentType === this.deedDocumentTypeEnum.Affidavit) {
			return true;
		}
		return false;
	}

	ngOnDestroy() {
		this.addressSubscription.unsubscribe();
	}
}
