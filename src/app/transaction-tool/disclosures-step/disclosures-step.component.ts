import { TRANSACTION_STATUSES, BLOCKCHAIN_TRANSACTION_STEPS } from './../../shared/deeds.service';
import { HelloSignService } from './../../shared/hello-sign.service';
import { DeedDocumentType } from './../enums/deed-document-type.enum';
import { Observable } from 'rxjs/Observable';
import { UserRoleEnum } from './../enums/user-role.enum';
import {
	SmartContractConnectionService,
	Status
} from './../../smart-contract-connection/smart-contract-connection.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TransactionToolDocumentService } from './../transaction-tool-document.service';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Base64Service } from '../../shared/base64.service';
import { DeedsService } from '../../shared/deeds.service';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { ErrorsService } from '../../shared/errors/errors.service';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ErrorsDecoratableComponent } from '../../shared/errors/errors.decoratable.component';
import { environment } from '../../../environments/environment';
import { PusherService } from '../../shared/pusher.service';

declare const HelloSign;

@Component({
	selector: 'app-disclosures-step',
	templateUrl: './disclosures-step.component.html',
	styleUrls: ['./disclosures-step.component.scss']
})
export class DisclosuresStepComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	public waitingTitle = 'Waiting seller broker to upload disclosures document';
	public disclosuresTitle = 'Disclosures';
	public previewDisclosuresSubtitle = 'Please review disclosures.';

	public deedDocumentTypeEnum = DeedDocumentType;
	public userInfo: any;
	public userIsBuyer: boolean;
	public userIsSeller: boolean;
	public userIsBuyerBroker: boolean;
	public userIsSellerBroker: boolean;
	public previewLink: string;
	private addressSubscription: Subscription;
	public deedId: string;
	public hasBuyerSigned: boolean;
	public hasSellerSigned: boolean;
	public hasBuyerBrokerSigned: boolean;
	public hasSellerBrokerSigned: boolean;
	public shouldSendToBlockchain: boolean;
	public signingDocument: any;
	public hasDataLoaded = false;
	private deedAddress: string;
	public recordButtonEnabled = true;
	public TRANSACTION_STATUSES = TRANSACTION_STATUSES;
	public transactionDetails: any = null;
	public deed: any;
	public shouldShowSignatureDelayNotes = false;
	private documentSignatureUpdatedSubscription: Subscription;

	constructor(private route: ActivatedRoute,
		private router: Router,
		private documentService: TransactionToolDocumentService,
		private smartContractService: SmartContractConnectionService,
		private helloSignService: HelloSignService,
		private deedsService: DeedsService,
		private notificationService: NotificationsService,
		private pusherService: PusherService,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);
	}

	async ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedId) {
			if (!deedId) {
				throw new Error('No deed address supplied');
			}
			self.deedId = deedId;
			self.reloadView();
		});

		this.documentSignatureUpdatedSubscription = this.pusherService.subscribeToDocumentSignatureUpdatedSubject({
			next: async (data: any) => {
				await this.setupDocument(this.deedId);
				this.hideSignatureDelayNote();
			}
		});
	}

	ngOnDestroy() {
		this.documentSignatureUpdatedSubscription.unsubscribe();
	}

	private async setupDocument(deedId: string) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		this.deed = deed;
		this.shouldSendToBlockchain = (deed.status === Status.Disclosures);
		this.signingDocument = this.getSignatureDocument(deed.documents);
		this.deedAddress = deed.deedContractAddress;
		await this.setupDocumentPreview(this.signingDocument);
	}

	private async setupDocumentPreview(doc: any) {
		if (doc && doc.fileName) {
			this.previewLink = doc.fileName;
		}
		this.getSellerDisclosuresSigners(doc);
	}

	private setupTransactionLink() {
		this.transactionDetails = null;
		for (const deal of this.deed.transactions) {
			if (deal.type === BLOCKCHAIN_TRANSACTION_STEPS.DISCLOSURES) {
				this.transactionDetails = deal;
				return;
			}
		}
	}

	private getSignatureDocument(documents: any[]) {
		let signatureDocument;
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.SignedDisclosures) {
				signatureDocument = doc;
			}
		}
		return signatureDocument;
	}

	public async signDocument() {
		if (!this.signingDocument) {
			throw new Error('No document to sign');
		}
		const response = await this.documentService.getSignUrl(this.signingDocument.uniqueId);
		const signingEvent = await this.helloSignService.signDocument(response);
		if (signingEvent === HelloSign.EVENT_SIGNED) {
			await this.deedsService.markDocumentSigned(this.signingDocument.id);
			this.showSignatureDelayNote();
		}
	}

	// TODO change message
	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async onRecordClick(password) {
		this.recordButtonEnabled = false;
		try {
			this.notificationService.pushInfo({
				title: `Recording the document to the Blockchain. Please do not leave this page.`,
				message: '',
				time: (new Date().getTime()),
				timeout: 60000
			});
			const documentString = await this.documentService.getDocumentContent(this.signingDocument.id);
			let result;
			try {
				result = await this.smartContractService.recordSellerDisclosures(password, this.deedAddress, documentString);
			} catch (e) {
				this.errorsService.pushError({
					errorTitle: '',
					errorMessage: e.message,
					errorTime: (new Date()).getTime()
				});
				this.recordButtonEnabled = true;
				return;
			}
			this.notificationService.pushInfo({
				title: `Sending the document to the backend.`,
				message: '',
				time: (new Date().getTime()),
				timeout: 10000
			});
			await this.deedsService.sendDocumentTxHash(this.signingDocument.id, result.transactionHash);
			await this.reloadView();
			this.notificationService.pushSuccess({
				title: 'Successfully Sent',
				message: '',
				time: (new Date().getTime()),
				timeout: 4000
			});

		} catch (err) {
			this.recordButtonEnabled = true;
			throw err;
		}
	}

	public getSellerDisclosuresSigners(doc: any) {
		if (!doc) {
			return;
		}

		this.hasBuyerSigned = this.hasPartySigned(doc, UserRoleEnum.Buyer);
		this.hasSellerSigned = this.hasPartySigned(doc, UserRoleEnum.Seller);
		this.hasBuyerBrokerSigned = this.hasPartySigned(doc, UserRoleEnum.BuyerBroker);
		this.hasSellerBrokerSigned = this.hasPartySigned(doc, UserRoleEnum.SellerBroker);
	}

	private hasPartySigned(doc: any, role: UserRoleEnum) {
		for (const signer of doc.signatures) {
			if (signer.role === role) {
				return signer.isSigned;
			}
		}
		return false;
	}

	public shouldShowSignButton(): boolean {
		return (this.userIsBuyer && !this.hasBuyerSigned)
			|| (this.userIsSeller && !this.hasSellerSigned)
			|| (this.userIsBuyerBroker && !this.hasBuyerBrokerSigned)
			|| (this.userIsSellerBroker && !this.hasSellerBrokerSigned);
	}

	private async mapCurrentUserToRole(deedAddress) {
		const deed = await this.deedsService.getDeedDetails(deedAddress);
		this.userIsBuyer = (deed.currentUserRole === UserRoleEnum.Buyer);
		this.userIsSeller = (deed.currentUserRole === UserRoleEnum.Seller);
		this.userIsSellerBroker = (deed.currentUserRole === UserRoleEnum.SellerBroker);
		this.userIsBuyerBroker = (deed.currentUserRole === UserRoleEnum.BuyerBroker);
	}

	private showSignatureDelayNote() {
		this.shouldShowSignatureDelayNotes = true;
	}

	private hideSignatureDelayNote() {
		this.shouldShowSignatureDelayNotes = false;
	}

	private async reloadView() {
		this.hasDataLoaded = false;
		await this.mapCurrentUserToRole(this.deedId);
		await this.setupDocument(this.deedId);
		this.setupTransactionLink();
		this.hasDataLoaded = true;

	}

}
