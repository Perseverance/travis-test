import { Component, OnInit } from '@angular/core';
import { DeedDocumentType } from '../enums/deed-document-type.enum';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';
import { TransactionToolDocumentService } from '../transaction-tool-document.service';
import { SmartContractConnectionService } from '../../smart-contract-connection/smart-contract-connection.service';
import { HelloSignService } from '../../shared/hello-sign.service';
import { DeedsService } from '../../shared/deeds.service';
import { Observable } from 'rxjs/Observable';
import { UserRoleEnum } from '../enums/user-role.enum';
import { Base64Service } from '../../shared/base64.service';
import { NotificationsService } from '../../shared/notifications/notifications.service';

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
	private addressSubscription: Subscription;
	public deedAddress: string;
	public hasBuyerSigned: boolean;
	public hasSellerSigned: boolean;
	public settlementTitle = 'Settlement statement';
	public uploadSettlementBuyerSubtitle = 'Buyer Settlement Statement';
	public uploadSettlementSellerSubtitle = 'Seller Settlement Statement';
	public successMessage = 'Success!';
	public hasDataLoaded = false;

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
			await self.getSettlementStatementSigners();
			self.hasDataLoaded = true;
		});
	}

	private async setupDocumentPreview(deedId: string) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		const buyerSignatureRequestId = this.getBuyerSignatureRequestId(deed.documents);
		if (buyerSignatureRequestId) {
			this.previewBuyerLink = await this.documentService.getPreviewDocumentLink(buyerSignatureRequestId);
		}
		const sellerSignatureRequestId = this.getSellerSignatureRequestId(deed.documents);
		if (sellerSignatureRequestId) {
			this.previewSellerLink = await this.documentService.getPreviewDocumentLink(sellerSignatureRequestId);
		}
	}

	private getBuyerSignatureRequestId(documents: any[]) {
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.BuyerSettlementStatement) {
				return doc.uniqueId;
			}
		}
	}

	private getSellerSignatureRequestId(documents: any[]) {
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.SellerSettlementStatement) {
				return doc.uniqueId;
			}
		}
	}

	public async uploadSellerDocument(event: any) {
		this.selectedSellerDocument = event;

		if (!this.selectedSellerDocument) {
			return;
		}
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
		this.previewBuyerLink = response.uniqueId;
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
		this.previewBuyerLink = response.uniqueId;
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	public async signBuyerDocument() {
		const deed = await this.deedsService.getDeedDetails(this.deedAddress);
		const requestSignatureId = this.getBuyerSignatureRequestId(deed.documents);
		const response = await this.documentService.getSignUrl(requestSignatureId);
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
				await this.setupDocumentPreview(this.deedAddress);
				this.notificationService.pushSuccess({
					title: 'Successfully Retrieved',
					message: '',
					time: (new Date().getTime()),
					timeout: 4000
				});
			}, this.helloSignService.SignatureUpdatingTimeoutInMilliseconds);
		}
	}

	public async signSellerDocument() {
		const deed = await this.deedsService.getDeedDetails(this.deedAddress);
		const requestSignatureId = this.getSellerSignatureRequestId(deed.documents);
		const response = await this.documentService.getSignUrl(requestSignatureId);
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
				await this.setupDocumentPreview(this.deedAddress);
				this.notificationService.pushSuccess({
					title: 'Successfully Retrieved',
					message: '',
					time: (new Date().getTime()),
					timeout: 4000
				});
			}, this.helloSignService.SignatureUpdatingTimeoutInMilliseconds);
		}
	}

	public async getSettlementStatementSigners() {
		await this.markBuyerSign();
		await this.markSellerSign();
	}

	private async markBuyerSign() {
		this.hasBuyerSigned = false;
	}

	private async markSellerSign() {
		this.hasSellerSigned = true;
	}

	public shouldShowSignButton(): boolean {
		return (this.userIsBuyer && !this.hasBuyerSigned)
			|| (this.userIsSeller && !this.hasSellerSigned);
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
