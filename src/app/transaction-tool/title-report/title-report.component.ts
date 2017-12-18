import {DeedDocumentType} from './../enums/deed-document-type.enum';
import {Observable} from 'rxjs/Observable';
import {UserRoleEnum} from './../enums/user-role.enum';
import {Base64Service} from './../../shared/base64.service';
import {HelloSignService} from './../../shared/hello-sign.service';
import {
	SmartContractConnectionService,
	Status
} from './../../smart-contract-connection/smart-contract-connection.service';
import {TransactionToolDocumentService} from './../transaction-tool-document.service';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService, UserData} from './../../authentication/authentication.service';
import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit} from '@angular/core';
import {DeedsService} from '../../shared/deeds.service';
import {DefaultAsyncAPIErrorHandling} from '../../shared/errors/errors.decorators';
import {NotificationsService} from '../../shared/notifications/notifications.service';
import {ErrorsDecoratableComponent} from '../../shared/errors/errors.decoratable.component';
import {ErrorsService} from '../../shared/errors/errors.service';
import {TranslateService} from '@ngx-translate/core';

declare const HelloSign;

@Component({
	selector: 'app-title-report',
	templateUrl: './title-report.component.html',
	styleUrls: ['./title-report.component.scss']
})
export class TitleReportComponent extends ErrorsDecoratableComponent implements OnInit {

	public waitingTitle = 'Waiting title company user to upload title report';
	public settlementTitle = 'Title Report';
	public uploadSettlementSubtitle = 'Please upload title report document:';
	public previewSettlementSubtitle = 'Please review title report.';

	public deedDocumentTypeEnum = DeedDocumentType;
	public userInfo: any;
	public userIsBuyer: boolean;
	public userIsSeller: boolean;
	public userIsTitleCompany: boolean;
	public selectedDocument: any;
	public signingDocument: any;
	public previewLink: string;
	private addressSubscription: Subscription;
	public deedId: string;
	public hasBuyerSigned: boolean;
	public hasSellerSigned: boolean;
	public shouldSendToBlockchain: boolean;

	constructor(private route: ActivatedRoute,
				private documentService: TransactionToolDocumentService,
				private smartContractService: SmartContractConnectionService,
				private helloSignService: HelloSignService,
				private base64Service: Base64Service,
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
		this.shouldSendToBlockchain = deed.status === Status.titleReport;
		this.signingDocument = this.getSignatureDocument(deed.documents);
		await this.setupDocumentPreview(this.signingDocument);
	}

	private async setupDocumentPreview(doc: any) {
		if (doc && doc.uniqueId) {
			this.previewLink = await this.documentService.getPreviewDocumentLink(doc.uniqueId);
		}
		this.getTitleReportSigners(doc);
	}

	private getSignatureDocument(documents: any[]) {
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.TitleReport) {
				return doc;
			}
		}
	}

	public async uploadDocument(event: any) {
		this.selectedDocument = event;

		if (!this.selectedDocument) {
			return;
		}
		const base64 = await this.base64Service.convertFileToBase64(this.selectedDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.TitleReport, this.deedId, base64);
		this.signingDocument = response;
		await this.setupDocumentPreview(this.signingDocument);
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
		const result = await this.smartContractService.recordTitleReport(documentString);
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

	public getTitleReportSigners(doc: any) {
		if (!doc) {
			return;
		}

		this.hasBuyerSigned = this.hasPartySigned(doc, UserRoleEnum.Buyer);
		this.hasSellerSigned = this.hasPartySigned(doc, UserRoleEnum.Seller);
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
			|| (this.userIsSeller && !this.hasSellerSigned);
	}

	private async mapCurrentUserToRole(deedAddress) {
		const deed = await this.deedsService.getDeedDetails(deedAddress);
		this.userIsBuyer = (deed.currentUserRole === UserRoleEnum.Buyer);
		this.userIsSeller = (deed.currentUserRole === UserRoleEnum.Seller);
		this.userIsTitleCompany = (deed.currentUserRole === UserRoleEnum.TitleCompany);
	}
}
