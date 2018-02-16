import {Component, OnInit} from '@angular/core';
import {DeedDocumentType} from '../enums/deed-document-type.enum';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';
import {TransactionToolDocumentService} from '../transaction-tool-document.service';
import {
	SmartContractConnectionService,
	Status
} from '../../smart-contract-connection/smart-contract-connection.service';
import {HelloSignService} from '../../shared/hello-sign.service';
import {DeedsService} from '../../shared/deeds.service';
import {Observable} from 'rxjs/Observable';
import {UserRoleEnum} from '../enums/user-role.enum';
import {Base64Service} from '../../shared/base64.service';
import {NotificationsService} from '../../shared/notifications/notifications.service';

declare const HelloSign;

@Component({
	selector: 'app-settlement-statement',
	templateUrl: './settlement-statement.component.html',
	styleUrls: ['./settlement-statement.component.scss']
})
export class SettlementStatementComponent implements OnInit {

	public deedDocumentTypeEnum = DeedDocumentType;
	public userIsBuyer: boolean;
	public userIsSeller: boolean;
	public userIsBuyerBroker: boolean;
	public userIsSellerBroker: boolean;
	public userIsTitleCompany: boolean;
	public selectedBuyerDocument: any;
	public selectedSellerDocument: any;
	public previewBuyerLink: string;
	public previewSellerLink: string;
	public buyerAgreeingDocument: any;
	public sellerAgreeingDocument: any;
	private addressSubscription: Subscription;
	public deedAddress: string;
	public hasBuyerAgreed: boolean;
	public hasSellerAgreed: boolean;
	public settlementTitle = 'Settlement statements';
	public uploadSettlementBuyerSubtitle = 'Buyer Settlement Statement';
	public uploadSettlementSellerSubtitle = 'Seller Settlement Statement';
	public successMessage = 'Success!';
	public hasDataLoaded = false;
	public reuploadingBuyerDocumentActivated: boolean;
	public reuploadingSellerDocumentActivated: boolean;
	public processingUploadBuyerDocumentActivated: boolean;
	public processingUploadSellerDocumentActivated: boolean;
	public deed: any;
	public deedStatus = Status;

	constructor(private route: ActivatedRoute,
				private documentService: TransactionToolDocumentService,
				private smartContractService: SmartContractConnectionService,
				private helloSignService: HelloSignService,
				private base64Service: Base64Service,
				private deedsService: DeedsService,
				private notificationService: NotificationsService) {
	}

	async ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedAddress) {
			if (!deedAddress) {
				throw new Error('No deed address supplied');
			}
			self.deedAddress = deedAddress;
			await self.mapCurrentUserToRole(deedAddress);
			await self.setupDocumentPreview(deedAddress);
			self.hasDataLoaded = true;
		});
	}

	private async setupDocumentPreview(deedId: string) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		this.deed = deed;
		this.buyerAgreeingDocument = this.getBuyerDocument(deed.documents);
		if (this.buyerAgreeingDocument) {
			this.previewBuyerLink = this.buyerAgreeingDocument.fileName;
			this.getBuyerSettlementStatementSigners(this.buyerAgreeingDocument);
		}
		this.sellerAgreeingDocument = this.getSellerDocument(deed.documents);
		if (this.sellerAgreeingDocument) {
			this.previewSellerLink = this.sellerAgreeingDocument.fileName;
			this.getSellerSettlementStatementSigners(this.sellerAgreeingDocument);
		}
	}

	private getBuyerDocument(documents: any[]) {
		let buyerDocument;
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.BuyerSettlementStatement) {
				buyerDocument = doc;
			}
		}
		return buyerDocument;
	}

	private getSellerDocument(documents: any[]) {
		let sellerDocument;
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.SellerSettlementStatement) {
				sellerDocument = doc;
			}
		}
		return sellerDocument;
	}

	public async uploadSellerDocument(event: any) {
		this.selectedSellerDocument = event;

		if (!this.selectedSellerDocument) {
			return;
		}
		this.processingUploadSellerDocumentActivated = true;
		this.notificationService.pushInfo({
			title: `Please wait. A document is uploading, so be patient.`,
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		const base64 = await this.base64Service.convertFileToBase64(this.selectedSellerDocument);
		const response = await this.documentService.uploadTransactionToolDocument(
			DeedDocumentType.SellerSettlementStatement,
			this.deedAddress,
			base64
		);
		this.previewSellerLink = response.fileName;
		this.reuploadingSellerDocumentActivated = false;
		this.processingUploadSellerDocumentActivated = false;
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	public async uploadBuyerDocument(event: any) {
		this.selectedBuyerDocument = event;

		if (!this.selectedBuyerDocument) {
			return;
		}
		this.notificationService.pushInfo({
			title: `Please wait. A document is uploading, so be patient.`,
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		const base64 = await this.base64Service.convertFileToBase64(this.selectedBuyerDocument);
		const response = await this.documentService.uploadTransactionToolDocument(
			DeedDocumentType.BuyerSettlementStatement,
			this.deedAddress,
			base64
		);
		this.previewBuyerLink = response.fileName;
		this.reuploadingBuyerDocumentActivated = false;
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	public async agreeBuyerDocument() {
		const deed = await this.deedsService.getDeedDetails(this.deedAddress);
		const buyerDocument = this.getBuyerDocument(deed.documents);
		await this.deedsService.markDocumentAgreed(buyerDocument.id);
		await this.setupDocumentPreview(this.deedAddress);
		this.notificationService.pushSuccess({
			title: 'Successfully Agreed',
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	public async agreeSellerDocument() {
		const deed = await this.deedsService.getDeedDetails(this.deedAddress);
		const sellerDocument = this.getSellerDocument(deed.documents);
		await this.deedsService.markDocumentAgreed(sellerDocument.id);
		await this.setupDocumentPreview(this.deedAddress);
		this.notificationService.pushSuccess({
			title: 'Successfully Agreed',
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	public getBuyerSettlementStatementSigners(doc: any) {
		if (!doc) {
			return;
		}

		this.hasBuyerAgreed = this.hasPartyAgreed(doc, UserRoleEnum.Buyer);
	}

	public getSellerSettlementStatementSigners(doc: any) {
		if (!doc) {
			return;
		}

		this.hasSellerAgreed = this.hasPartyAgreed(doc, UserRoleEnum.Seller);
	}

	private hasPartyAgreed(doc: any, role: UserRoleEnum) {
		for (const signer of doc.signatures) {
			if (signer.role === role) {
				return signer.isSigned;
			}
		}
		return false;
	}

	public shouldShowAgreedButton(): boolean {
		return (this.userIsBuyer && !this.hasBuyerAgreed)
			|| (this.userIsSeller && !this.hasSellerAgreed);
	}

	private async mapCurrentUserToRole(deedAddress) {
		const deed = await this.deedsService.getDeedDetails(deedAddress);
		this.userIsBuyer = (deed.currentUserRole === UserRoleEnum.Buyer);
		this.userIsSeller = (deed.currentUserRole === UserRoleEnum.Seller);
		this.userIsSellerBroker = (deed.currentUserRole === UserRoleEnum.SellerBroker);
		this.userIsBuyerBroker = (deed.currentUserRole === UserRoleEnum.BuyerBroker);
		this.userIsTitleCompany = (deed.currentUserRole === UserRoleEnum.TitleCompany);
	}

}
