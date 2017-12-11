import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserData} from '../../authentication/authentication.service';
import {UserRoleEnum} from '../enums/user-role.enum';
import {TransactionToolWorkflowService} from '../workflow/workflow.service';
import {TransactionToolDocumentService} from '../transaction-tool-document.service';
import {DeedDocumentType} from '../enums/deed-document-type.enum';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {SmartContractConnectionService} from '../../smart-contract-connection/smart-contract-connection.service';
import {HelloSignService} from '../../shared/hello-sign.service';

declare const HelloSign;

@Component({
	selector: 'app-purchase-agreement-step',
	templateUrl: './purchase-agreement-step.component.html',
	styleUrls: ['./purchase-agreement-step.component.scss']
})
export class PurchaseAgreementStepComponent implements OnInit {
	public userInfo: any;
	public userIsBuyer: boolean;
	public userIsSeller: boolean;
	public userIsBroker: boolean;
	public selectedDocument: any;
	public previewLink: string;
	private addressSubscription: Subscription;
	public deedAddress: string;
	public hasBuyerSigned: boolean;
	public hasSellerSigned: boolean;
	public hasBrokerSigned: boolean;
	public signDocumentButtonLabel: string;
	public uploadPurchaseTitle = 'Purchase Agreement';
	public uploadPurchaseSubtitle = 'Please upload purchase agreement document:';

	constructor(private authService: AuthenticationService,
				private route: ActivatedRoute,
				private documentService: TransactionToolDocumentService,
				private smartContractService: SmartContractConnectionService,
				private helloSignService: HelloSignService) {
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
				this.userIsBuyer = (userInfo.user.role === UserRoleEnum.Buyer);
				this.userIsBroker = (userInfo.user.role === UserRoleEnum.Agent);
				this.userIsSeller = (userInfo.user.role === UserRoleEnum.Seller);
			}
		});
	}

	async ngOnInit() {
		this.signDocumentButtonLabel = 'Sign agreement';
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedAddress) {
			if (!deedAddress) {
				throw new Error('No deed address supplied');
			}
			self.deedAddress = deedAddress;
			if (!await self.smartContractService.isPurchaseAgreementUploaded(deedAddress)) {
				return;
			}
			await self.setupDocumentPreview();
			await self.getPurchaseAgreementSigners();
		});
	}

	private async setupDocumentPreview() {
		const requestSignatureId = await this.smartContractService.getPurchaseAgreementSignatureRequestId(this.deedAddress);
		this.previewLink = await this.documentService.getPreviewDocumentLink(requestSignatureId);
	}

	public async uploadDocument(event: any) {
		this.selectedDocument = event;

		if (!this.selectedDocument) {
			return;
		}
		const base64 = await this.convertToBase64(this.selectedDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.PurchaseAgreement, this.deedAddress, base64);
		this.previewLink = response.downloadLink;
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

	public async getPurchaseAgreementSigners() {
		await this.markBuyerSign();
		await this.markSellerSign();
		await this.markBrokerSign();
	}

	private async markBuyerSign() {
		this.hasBuyerSigned = await this.smartContractService.hasBuyerSignedPurchaseAgreement(this.deedAddress);
	}

	private async markSellerSign() {
		this.hasSellerSigned = await this.smartContractService.hasSellerSignedPurchaseAgreement(this.deedAddress);
	}

	private async markBrokerSign() {
		this.hasBrokerSigned = await this.smartContractService.hasBrokerSignedPurchaseAgreement(this.deedAddress);
	}

	public shouldShowSignButton(): boolean {
		return (this.userIsBuyer && !this.hasBuyerSigned)
			|| (this.userIsSeller && !this.hasSellerSigned)
			|| (this.userIsBroker && !this.hasBrokerSigned);
	}
}
