import { CustomNumberValidator } from './eth-price-validator';
import { REVERSE_STEPS } from './../workflow/workflow.model';
import { TransactionToolDocumentService } from './../transaction-tool-document.service';
import { DeedDocumentType } from './../enums/deed-document-type.enum';
import { Base64Service } from './../../shared/base64.service';
import { FormGroup, Validators, FormBuilder, FormControl, ValidationErrors } from '@angular/forms';
import { UserRoleEnum } from './../enums/user-role.enum';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { NotificationsService } from './../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {
	SmartContractAddress,
	Status,
	SmartContractConnectionService
} from './../../smart-contract-connection/smart-contract-connection.service';
import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { DeedsService } from '../../shared/deeds.service';

export enum InvitationStatus {
	NotInvited = 0,
	Invited = 1,
	Accepted = 2,
	Rejected = 3
}

@Component({
	selector: 'app-invite',
	templateUrl: './invite.component.html',
	styleUrls: ['./invite.component.scss']
})
export class InviteComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	public userRoleEnum = UserRoleEnum;
	public invitationDataLoaded = false;
	public successMessage = 'Success!';
	public userRole: UserRoleEnum;
	public selectedDocument: any;
	public disclosuresLink: string = undefined;
	private addressSubscription: Subscription;
	public deedId: string;
	public arePartiesInvited: boolean;
	public hasSellerResponded: boolean;
	public hasBuyerResponded: boolean;
	public hasBuyerBrokerResponded: boolean;
	public hasTitleCompanyResponded: boolean;
	public reuploadingDocumentActivated: boolean;
	public isWaitingForReservation = false;
	public deed: any;
	public deedStatus = Status;

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
		private smartContractConnection: SmartContractConnectionService,
		private router: Router,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);

		this.inviteForm = this.formBuilder.group({
			sellerEmail: ['', [Validators.required, Validators.email]],
			buyerEmail: ['', [Validators.required, Validators.email]],
			buyerAgentEmail: ['', [Validators.required, Validators.email]],
			titleCompanyEmail: ['', [Validators.required, Validators.email]],
			priceInEth: ['', [Validators.required, CustomNumberValidator.minimalNumber]],
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
			await self.setupDeedData(deedId);
			self.hasDataLoaded = true;
			self.invitationDataLoaded = true;
		});
	}

	private async setupDeedData(deedId) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		this.deed = deed;
		this.hasBuyerBrokerResponded = (deed.buyerBrokerStatus > InvitationStatus.Invited);
		this.hasBuyerResponded = (deed.buyerStatus > InvitationStatus.Invited);
		this.hasSellerResponded = (deed.sellerStatus > InvitationStatus.Invited);
		this.hasTitleCompanyResponded = (deed.titleCompanyStatus > InvitationStatus.Invited);
		this.arePartiesInvited = (deed.status >= Status.partiesInvited);
		this.userRole = deed.currentUserRole;
		this.disclosuresLink = this.getPreviewLink(deed.documents);
		this.isWaitingForReservation = (deed.status === Status.partiesAccepted);
	}

	private getPreviewLink(documents: any[]) {
		let documentPreviewLink;
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.Disclosures) {
				documentPreviewLink = doc.fileName;
			}
		}
		return documentPreviewLink;
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
		this.notificationService.pushInfo({
			title: `Please wait. A document is uploading, so be patient.`,
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		const base64 = await this.base64Service.convertFileToBase64(this.selectedDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.Disclosures, this.deedId, base64);
		this.disclosuresLink = response.fileName;
		this.reuploadingDocumentActivated = false;
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
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
		await this.setupDeedData(this.deedId);
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	// TODO change message
	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async partyAccept() {
		this.notificationService.pushInfo({
			title: `Inviting Accepting invitation`,
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		const result = await this.deedsService.acceptInvite(this.deedId);
		if (result.allPartiesAccepted) {
			this.router.navigate(['transaction-tool', this.deedId]);
		}
		await this.setupDeedData(this.deedId);
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	// TODO change message
	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async partyReject() {
		this.notificationService.pushInfo({
			title: `Rejecting Invitation`,
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		await this.deedsService.rejectInvite(this.deedId);
		await this.setupDeedData(this.deedId);
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}
}
