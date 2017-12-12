import { TransactionToolDocumentService } from './../transaction-tool-document.service';
import { DeedDocumentType } from './../enums/deed-document-type.enum';
import { Base64Service } from './../../shared/base64.service';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { UserRoleEnum } from './../enums/user-role.enum';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { NotificationsService } from './../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SmartContractAddress, Status } from './../../smart-contract-connection/smart-contract-connection.service';
import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { DeedsService } from '../../shared/deeds.service';

@Component({
	selector: 'app-invite',
	templateUrl: './invite.component.html',
	styleUrls: ['./invite.component.scss']
})
export class InviteComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	public invitationDataLoaded = false;
	public successMessage = 'Success!';
	public userIsSellerBroker = false;
	public selectedDocument: any;
	public previewLink: string;
	private addressSubscription: Subscription;
	public deedId: string;
	public arePartiesInvited: boolean;

	private userInfo: any;
	public hasDataLoaded = false;

	public disclosuresTitle = 'Disclosures';
	public uploadDisclosuresSubtitle = 'Please upload disclosures document:';

	public inviteForm: FormGroup;

	constructor(private authService: AuthenticationService,
		private route: ActivatedRoute,
		private deedsService: DeedsService,
		private notificationService: NotificationsService,
		private formBuilder: FormBuilder,
		private base64Service: Base64Service,
		private documentService: TransactionToolDocumentService,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);

		this.inviteForm = this.formBuilder.group({
			sellerEmail: ['', [Validators.required]],
			buyerEmail: ['', [Validators.required]],
			buyerAgentEmail: ['', [Validators.required]],
			titleCompanyEmail: ['', [Validators.required]],
			priceInEth: ['', [Validators.required]],
		});

		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.isAnonymous) {
					return;
				}
			}
		});

	}

	async ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedId) {
			if (!deedId) {
				throw new Error('No deed address supplied');
			}
			self.deedId = deedId;
			const deed = await self.deedsService.getDeedDetails(deedId);
			self.arePartiesInvited = (deed.status >= Status.partiesInvited);
			self.userIsSellerBroker = (deed.currentUserRole === UserRoleEnum.SellerBroker);
			self.hasDataLoaded = true;
			self.invitationDataLoaded = true;
		});

	}

	ngOnDestroy() {
		this.addressSubscription.unsubscribe();
	}

	public get sellerEmail() {
		return this.inviteForm.get('sellerEmail');
	}

	public get buyerEmail() {
		return this.inviteForm.get('buyerEmail');
	}

	public get buyerAgentEmail() {
		return this.inviteForm.get('buyerAgentEmail');
	}

	public get titleCompanyEmail() {
		return this.inviteForm.get('titleCompanyEmail');
	}

	public get priceInEth() {
		return this.inviteForm.get('priceInEth');
	}

	public async uploadDocument(event: any) {
		this.selectedDocument = event;

		if (!this.selectedDocument) {
			return;
		}
		const base64 = await this.base64Service.convertFileToBase64(this.selectedDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.SettlementStatement, this.deedId, base64);
		this.previewLink = response.downloadLink;
	}

	// TODO change message
	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async onInvite(email) {
		this.notificationService.pushInfo({
			title: `Inviting ${email}. Please wait. A normal blockchain transaction can go up to few minutes, so be patient.`,
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		await this.deedsService.inviteParties(
			this.deedId,
			this.buyerEmail.value,
			this.sellerEmail.value,
			this.buyerAgentEmail.value,
			this.titleCompanyEmail.value,
			this.priceInEth.value);
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}
}
