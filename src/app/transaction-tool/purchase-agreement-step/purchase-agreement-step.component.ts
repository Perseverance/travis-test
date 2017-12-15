import { Component, OnInit } from '@angular/core';
import { AuthenticationService, UserData } from '../../authentication/authentication.service';
import { UserRoleEnum } from '../enums/user-role.enum';
import { TransactionToolWorkflowService } from '../workflow/workflow.service';
import { TransactionToolDocumentService } from '../transaction-tool-document.service';
import { DeedDocumentType } from '../enums/deed-document-type.enum';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { SmartContractConnectionService } from '../../smart-contract-connection/smart-contract-connection.service';
import { HelloSignService } from '../../shared/hello-sign.service';
import { DeedsService } from '../../shared/deeds.service';
import { Base64Service } from '../../shared/base64.service';

declare const HelloSign;

@Component({
	selector: 'app-purchase-agreement-step',
	templateUrl: './purchase-agreement-step.component.html',
	styleUrls: ['./purchase-agreement-step.component.scss']
})
export class PurchaseAgreementStepComponent implements OnInit {
	public deedDocumentTypeEnum = DeedDocumentType;
	public userInfo: any;
	public userIsBuyer: boolean;
	public userIsSeller: boolean;
	public userIsBuyerBroker: boolean;
	public userIsSellerBroker: boolean;
	public selectedDocument: any;
	public previewLink: string;
	private addressSubscription: Subscription;
	public deedAddress: string;
	public hasBuyerSigned: boolean;
	public hasSellerSigned: boolean;
	public hasBuyerBrokerSigned: boolean;
	public hasSellerBrokerSigned: boolean;
	public purchaseTitle = 'Purchase Agreement';
	public uploadPurchaseSubtitle = 'Please upload purchase agreement document:';
	public previewPurchaseSubtitle = 'Please review and sign purchase agreement.';

	constructor(private route: ActivatedRoute,
		private documentService: TransactionToolDocumentService,
		private smartContractService: SmartContractConnectionService,
		private helloSignService: HelloSignService,
		private deedsService: DeedsService,
		private base64Service: Base64Service) {
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
			await self.getPurchaseAgreementSigners();
		});
	}

	private async setupDocumentPreview(deedId: string) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		const signatureRequestId = this.getSignatureRequestId(deed.documents);
		if (signatureRequestId) {
			this.previewLink = await this.documentService.getPreviewDocumentLink(signatureRequestId);
		}
	}

	private getSignatureRequestId(documents: any[]) {
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.PurchaseAgreement) {
				return doc.uniqueId;
			}
		}
	}

	public async uploadDocument(event: any) {
		this.selectedDocument = event;

		if (!this.selectedDocument) {
			return;
		}
		const base64 = await this.base64Service.convertFileToBase64(this.selectedDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.PurchaseAgreement, this.deedAddress, base64);
		this.previewLink = response.downloadLink;
	}


	public async signDocument() {
		const deed = await this.deedsService.getDeedDetails(this.deedAddress);
		const requestSignatureId = this.getSignatureRequestId(deed.documents);
		const response = await this.documentService.getSignUrl(requestSignatureId);
		const signingEvent = await this.helloSignService.signDocument(response);
		if (signingEvent === HelloSign.EVENT_SIGNED) {
			setTimeout(async () => {
				// Workaround: waiting HelloSign to update new signature
				await this.setupDocumentPreview(this.deedAddress);
			}, this.helloSignService.SignatureUpdatingTimeoutInMilliseconds);
		}
	}

	public async getPurchaseAgreementSigners() {
		await this.markBuyerSign();
		await this.markSellerSign();
		await this.markBuyerBrokerSign();
		await this.markSellerBrokerSign();
	}

	private async markBuyerSign() {
		this.hasBuyerSigned = false;
	}

	private async markSellerSign() {
		this.hasSellerSigned = false;
	}

	private async markBuyerBrokerSign() {
		this.hasBuyerBrokerSigned = true;
	}

	private async markSellerBrokerSign() {
		this.hasSellerBrokerSigned = true;
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
