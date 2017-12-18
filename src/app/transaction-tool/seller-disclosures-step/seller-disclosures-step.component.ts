import {HelloSignService} from './../../shared/hello-sign.service';
import {DeedDocumentType} from './../enums/deed-document-type.enum';
import {Observable} from 'rxjs/Observable';
import {UserRoleEnum} from './../enums/user-role.enum';
import {
	SmartContractConnectionService,
	Status
} from './../../smart-contract-connection/smart-contract-connection.service';
import {ActivatedRoute} from '@angular/router';
import {TransactionToolDocumentService} from './../transaction-tool-document.service';
import {AuthenticationService, UserData} from './../../authentication/authentication.service';
import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit} from '@angular/core';
import {Base64Service} from '../../shared/base64.service';
import {DeedsService} from '../../shared/deeds.service';
import {DefaultAsyncAPIErrorHandling} from '../../shared/errors/errors.decorators';
import {ErrorsService} from '../../shared/errors/errors.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationsService} from '../../shared/notifications/notifications.service';
import {ErrorsDecoratableComponent} from '../../shared/errors/errors.decoratable.component';

declare const HelloSign;

@Component({
	selector: 'app-seller-disclosures-step',
	templateUrl: './seller-disclosures-step.component.html',
	styleUrls: ['./seller-disclosures-step.component.scss']
})
export class SellerDisclosuresStepComponent extends ErrorsDecoratableComponent implements OnInit {

	public waitingTitle = 'Waiting seller broker to upload seller disclosures document';
	public disclosuresTitle = 'Seller Disclosures';
	public previewDisclosuresSubtitle = 'Please review seller disclosures.';

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

	constructor(private route: ActivatedRoute,
				private documentService: TransactionToolDocumentService,
				private smartContractService: SmartContractConnectionService,
				private helloSignService: HelloSignService,
				private deedsService: DeedsService,
				private notificationService: NotificationsService,
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
		});
	}

	private async setupDocument(deedId: string) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		this.shouldSendToBlockchain = (deed.status === Status.titleReport);
		this.signingDocument = this.getSignatureDocument(deed.documents);
		await this.setupDocumentPreview(this.signingDocument);
	}

	private async setupDocumentPreview(doc: any) {
		if (doc && doc.uniqueId) {
			this.previewLink = await this.documentService.getPreviewDocumentLink(doc.uniqueId);
		}
		this.getSellerDisclosuresSigners(doc);
	}

	private getSignatureDocument(documents: any[]) {
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.TitleReport) {
				return doc;
			}
		}
	}

	public async signDocument() {
		if (!this.signingDocument) {
			throw new Error('No document to sign');
		}
		const response = await this.documentService.getSignUrl(this.signingDocument.uniqueId);
		const signingEvent = await this.helloSignService.signDocument(response);
		if (signingEvent === HelloSign.EVENT_SIGNED) {
			await this.deedsService.markDocumentSigned(this.signingDocument.id);
			setTimeout(async () => {
				// Workaround: waiting HelloSign to update new signature
				await this.setupDocument(this.deedId);
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
		const documentString = await this.documentService.getDocumentData(this.previewLink);
		const result = await this.smartContractService.recordSellerDisclosures(documentString);
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
		this.notificationService.pushSuccess({
			title: 'Successfully Sent',
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
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

}
