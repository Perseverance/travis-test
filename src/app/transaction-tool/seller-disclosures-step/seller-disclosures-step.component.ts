import { HelloSignService } from './../../shared/hello-sign.service';
import { DeedDocumentType } from './../enums/deed-document-type.enum';
import { Observable } from 'rxjs/Observable';
import { UserRoleEnum } from './../enums/user-role.enum';
import { SmartContractConnectionService } from './../../smart-contract-connection/smart-contract-connection.service';
import { ActivatedRoute } from '@angular/router';
import { TransactionToolDocumentService } from './../transaction-tool-document.service';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';
import { Base64Service } from '../../shared/base64.service';

declare const HelloSign;

@Component({
	selector: 'app-seller-disclosures-step',
	templateUrl: './seller-disclosures-step.component.html',
	styleUrls: ['./seller-disclosures-step.component.scss']
})
export class SellerDisclosuresStepComponent implements OnInit {

	public waitingTitle = 'Waiting to upload seller disclosures document';
	public disclosuresTitle = 'Seller Disclosure';
	public uploadDisclosuresSubtitle = 'Please upload seller disclosure documents:';
	public previewDisclosuresSubtitle = 'Please review and sign seller disclosure.';

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

	constructor(private authService: AuthenticationService,
		private route: ActivatedRoute,
		private documentService: TransactionToolDocumentService,
		private smartContractService: SmartContractConnectionService,
		private helloSignService: HelloSignService,
		private base64Service: Base64Service) {
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
				this.userIsBuyer = (userInfo.user.role === UserRoleEnum.Buyer);
				// this.userIsBroker = (userInfo.user.role === UserRoleEnum.Agent);
				this.userIsSeller = (userInfo.user.role === UserRoleEnum.Seller);
			}
		});
	}

	async ngOnInit() {
		this.signDocumentButtonLabel = 'Sign seller disclosures';
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedAddress) {
			if (!deedAddress) {
				throw new Error('No deed address supplied');
			}
			self.deedAddress = deedAddress;
			if (!await self.smartContractService.isSellerDisclosuresUploaded(deedAddress)) {
				return;
			}
			await self.setupDocumentPreview();
			await self.getSellerDisclosuresSigners();
		});
	}

	private async setupDocumentPreview() {
		const requestSignatureId = await this.smartContractService.getSellerDisclosuresSignatureRequestId(this.deedAddress);
		this.previewLink = await this.documentService.getPreviewDocumentLink(requestSignatureId);
	}

	public async uploadDocument(event: any) {
		this.selectedDocument = event;

		if (!this.selectedDocument) {
			return;
		}
		const base64 = await this.base64Service.convertFileToBase64(this.selectedDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.SellerDisclosures, this.deedAddress, base64);
		this.previewLink = response.downloadLink;
	}


	public async signDocument() {
		const requestSignatureId = await this.smartContractService.getSellerDisclosuresSignatureRequestId(this.deedAddress);
		const response = await this.documentService.getSignUrl(requestSignatureId);
		const signingEvent = await this.helloSignService.signDocument(response);
		if (signingEvent === HelloSign.EVENT_SIGNED) {
			await this.smartContractService.signSellerDisclosures(this.deedAddress, requestSignatureId);
			setTimeout(async () => {
				// Workaround: waiting HelloSign to update new signature
				await this.setupDocumentPreview();
			}, this.helloSignService.SignatureUpdatingTimeoutInMilliseconds);
		}
	}

	public async getSellerDisclosuresSigners() {
		await this.markBuyerSign();
		await this.markSellerSign();
		await this.markBrokerSign();
	}

	private async markBuyerSign() {
		this.hasBuyerSigned = await this.smartContractService.hasBuyerSignedSellerDisclosures(this.deedAddress);
	}

	private async markSellerSign() {
		this.hasSellerSigned = await this.smartContractService.hasSellerSignedSellerDisclosures(this.deedAddress);
	}

	private async markBrokerSign() {
		this.hasBrokerSigned = await this.smartContractService.hasBrokerSignedSellerDisclosures(this.deedAddress);
	}

	public shouldShowSignButton(): boolean {
		return (this.userIsBuyer && !this.hasBuyerSigned)
			|| (this.userIsSeller && !this.hasSellerSigned)
			|| (this.userIsBroker && !this.hasBrokerSigned);
	}

}
