import { NotificationsService } from './../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserData } from '../../authentication/authentication.service';
import { UserRoleEnum } from '../enums/user-role.enum';
import { TransactionToolWorkflowService } from '../workflow/workflow.service';
import { TransactionToolDocumentService } from '../transaction-tool-document.service';
import { DeedDocumentType } from '../enums/deed-document-type.enum';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import {
	SmartContractConnectionService,
	Status
} from '../../smart-contract-connection/smart-contract-connection.service';
import { HelloSignService } from '../../shared/hello-sign.service';
import { DeedsService } from '../../shared/deeds.service';
import { Base64Service } from '../../shared/base64.service';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';

declare const HelloSign;

@Component({
	selector: 'app-purchase-agreement-step',
	templateUrl: './purchase-agreement-step.component.html',
	styleUrls: ['./purchase-agreement-step.component.scss']
})
export class PurchaseAgreementStepComponent extends ErrorsDecoratableComponent implements OnInit {
	public deedDocumentTypeEnum = DeedDocumentType;
	public userInfo: any;
	public userIsBuyer: boolean;
	public userIsSeller: boolean;
	public userIsBuyerBroker: boolean;
	public userIsSellerBroker: boolean;
	public selectedDocument: any;
	public signingDocument: any;
	public previewLink: string;
	private addressSubscription: Subscription;
	public deedId: string;
	public hasBuyerSigned = false;
	public hasSellerSigned = false;
	public hasBuyerBrokerSigned = false;
	public hasSellerBrokerSigned = false;
	public shouldSendToBlockchain: boolean;
	public purchaseTitle = 'Purchase Agreement';
	public uploadPurchaseSubtitle = 'Please upload purchase agreement document:';
	public previewPurchaseSubtitle = 'Please review and sign purchase agreement.';
	public successMessage = 'Success!';
	public hasDataLoaded = false;
	private deedAddress: string;


	constructor(private route: ActivatedRoute,
		private documentService: TransactionToolDocumentService,
		private smartContractService: SmartContractConnectionService,
		private helloSignService: HelloSignService,
		private deedsService: DeedsService,
		private base64Service: Base64Service,
		private notificationService: NotificationsService,
		private router: Router,
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
			await self.mapCurrentUserToRole(deedId);
			await self.setupDocument(deedId);
			self.hasDataLoaded = true;

		});
	}

	private async setupDocument(deedId: string) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		this.shouldSendToBlockchain = (deed.status === Status.purchaseAgreement);
		this.signingDocument = this.getSignatureDocument(deed.documents);
		this.deedAddress = deed.deedContractAddress;
		await this.setupDocumentPreview(this.signingDocument);
	}

	private async setupDocumentPreview(doc: any) {
		if (doc && doc.fileName) {
			this.previewLink = doc.fileName;
		}
		this.getPurchaseAgreementSigners(doc);
	}

	private getSignatureDocument(documents: any[]) {
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.PurchaseAgreement) {
				return doc;
			}
		}
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
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.PurchaseAgreement, this.deedId, base64);
		this.signingDocument = response;
		await this.setupDocumentPreview(this.signingDocument);
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}


	public async signDocument() {
		if (!this.signingDocument) {
			throw new Error('No document to sign');
		}
		const response = await this.documentService.getSignUrl(this.signingDocument.uniqueId);
		const signingEvent = await this.helloSignService.signDocument(response);
		if (signingEvent === HelloSign.EVENT_SIGNED) {
			this.notificationService.pushInfo({
				title: `Retrieving signed document.`,
				message: '',
				time: (new Date().getTime()),
				timeout: 60000
			});
			setTimeout(async () => {
				// Workaround: waiting HelloSign to update new signature
				await this.deedsService.markDocumentSigned(this.signingDocument.id);
				await this.setupDocument(this.deedId);
				this.notificationService.pushSuccess({
					title: 'Successfully Retrieved',
					message: '',
					time: (new Date().getTime()),
					timeout: 4000
				});
			}, this.helloSignService.SignatureUpdatingTimeoutInMilliseconds);
		}
	}

	// TODO change message
	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async sendDocumentToBlockchain() {
		this.notificationService.pushInfo({
			title: `Sending the document to the blockchain.`,
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		const documentString = await this.documentService.getDocumentContent(this.signingDocument.id);
		const result = await this.smartContractService.recordPurchaseAgreement(this.deedAddress, documentString);
		if (result.status === '0x0') {
			throw new Error('Could not save to the blockchain. Try Again');
		}
		this.notificationService.pushInfo({
			title: `Sending the document to the backend.`,
			message: '',
			time: (new Date().getTime()),
			timeout: 10000
		});
		await this.deedsService.sendDocumentTxHash(this.signingDocument.id, result.transactionHash);
		this.router.navigate(['transaction-tool', this.deedId]);
		this.notificationService.pushSuccess({
			title: 'Successfully Sent',
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	public getPurchaseAgreementSigners(doc: any) {
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

	private async mapCurrentUserToRole(deedId) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		this.userIsBuyer = (deed.currentUserRole === UserRoleEnum.Buyer);
		this.userIsSeller = (deed.currentUserRole === UserRoleEnum.Seller);
		this.userIsSellerBroker = (deed.currentUserRole === UserRoleEnum.SellerBroker);
		this.userIsBuyerBroker = (deed.currentUserRole === UserRoleEnum.BuyerBroker);
	}
}
