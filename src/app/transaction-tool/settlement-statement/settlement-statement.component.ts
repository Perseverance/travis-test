import {Component, OnInit} from '@angular/core';
import {DeedDocumentType} from '../enums/deed-document-type.enum';
import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute} from '@angular/router';
import {TransactionToolDocumentService} from '../transaction-tool-document.service';
import {SmartContractConnectionService} from '../../smart-contract-connection/smart-contract-connection.service';
import {HelloSignService} from '../../shared/hello-sign.service';
import {DeedsService} from '../../shared/deeds.service';
import {Observable} from 'rxjs/Observable';
import {UserRoleEnum} from '../enums/user-role.enum';

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

	constructor(private route: ActivatedRoute,
				private documentService: TransactionToolDocumentService,
				private smartContractService: SmartContractConnectionService,
				private helloSignService: HelloSignService,
				private deedsService: DeedsService) {
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
			if (!await self.smartContractService.isSettlementStatementUploaded(deedAddress)) {
				return;
			}
			await self.setupDocumentPreview();
			await self.getSettlementStatementSigners();
		});
	}

	private async setupDocumentPreview() {
		const buyerRequestSignatureId = await this.smartContractService.getSettlementStatementBuyerSignatureRequestId(this.deedAddress);
		if (buyerRequestSignatureId) {
			this.previewBuyerLink = await this.documentService.getPreviewDocumentLink(buyerRequestSignatureId);
		}

		const sellerRequestSignatureId = await this.smartContractService.getSettlementStatementSellerSignatureRequestId(this.deedAddress);
		if (sellerRequestSignatureId) {
			this.previewSellerLink = await this.documentService.getPreviewDocumentLink(sellerRequestSignatureId);
		}
	}

	public async uploadSellerDocument(event: any) {
		this.selectedSellerDocument = event;

		if (!this.selectedSellerDocument) {
			return;
		}
		const base64 = await this.convertToBase64(this.selectedSellerDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.SellerSettlementStatement, this.deedAddress, base64);
		this.previewBuyerLink = response.downloadLink;
	}

	public async uploadBuyerDocument(event: any) {
		this.selectedBuyerDocument = event;

		if (!this.selectedBuyerDocument) {
			return;
		}
		const base64 = await this.convertToBase64(this.selectedBuyerDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.BuyerSettlementStatement, this.deedAddress, base64);
		this.previewBuyerLink = response.downloadLink;
	}

	public async convertToBase64(document): Promise<string> {
		const self = this;
		const base64 = await (new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = function () {
				const base64dataWithHeaders = reader.result;

				// The reader normally adds something like this before the base64 - 'data:application/pdf;base64,'
				// it needs to be removed
				const base64dataWithoutHeaders = self.removeBase64Headers(base64dataWithHeaders);
				resolve(base64dataWithoutHeaders);
			};

			reader.readAsDataURL(document);
		}));
		return base64;
	}

	private removeBase64Headers(base64dataWithHeaders: string) {
		const base64Headers = 'base64,';
		const headerIndex = base64dataWithHeaders.indexOf(base64Headers);
		if (headerIndex === -1) {
			// Headers were not found, probably good to go
			return base64dataWithHeaders;
		}

		const base64DataStartsAt = headerIndex + base64Headers.length;
		return base64dataWithHeaders.substring(base64DataStartsAt);
	}

	public async signDocument() {
		const requestSignatureId = await this.smartContractService.getPurchaseAgreementSignatureRequestId(this.deedAddress);
		const response = await this.documentService.getSignUrl(requestSignatureId);
		const signingEvent = await this.helloSignService.signDocument(response);
		if (signingEvent === HelloSign.EVENT_SIGNED) {
			await this.smartContractService.signPurchaseAgreement(this.deedAddress, requestSignatureId);
			setTimeout(async () => {
				// Workaround: waiting HelloSign to update new signature
				await this.setupDocumentPreview();
			}, this.helloSignService.SignatureUpdatingTimeoutInMilliseconds);
		}
	}

	public async getSettlementStatementSigners() {
		await this.markBuyerSign();
		await this.markSellerSign();
	}

	private async markBuyerSign() {
		this.hasBuyerSigned = await this.smartContractService.hasBuyerSignedSettlementStatement(this.deedAddress);
	}

	private async markSellerSign() {
		this.hasSellerSigned = await this.smartContractService.hasSellerSignedSettlementStatement(this.deedAddress);
	}

	public shouldShowSignButton(): boolean {
		return (this.userIsBuyer && !this.hasBuyerSigned)
			|| (this.userIsSeller && !this.hasSellerSigned);
	}

	private async mapCurrentUserToRole(deedAddress) {
		const deed = await this.deedsService.getDeedDetails(deedAddress);
		console.log(deed);
		this.userIsBuyer = (deed.currentUserRole === UserRoleEnum.Buyer);
		this.userIsSeller = (deed.currentUserRole === UserRoleEnum.Seller);
		this.userIsSellerBroker = (deed.currentUserRole === UserRoleEnum.SellerBroker);
		this.userIsBuyerBroker = (deed.currentUserRole === UserRoleEnum.BuyerBroker);
		this.userIsTitleCompany = (deed.currentUserRole === UserRoleEnum.TitleCompany);
	}

}
