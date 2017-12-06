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

declare const HelloSign;

@Component({
	selector: 'app-seller-disclosures-step',
	templateUrl: './seller-disclosures-step.component.html',
	styleUrls: ['./seller-disclosures-step.component.scss']
})
export class SellerDisclosuresStepComponent implements OnInit {

	public waitingTitle = 'Waiting to upload seller disclosures document';

	public userInfo: any;
	public userIsSeller = false;
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
		private helloSignService: HelloSignService) {
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
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
			if (!await self.smartContractService.isSellerDisclosuresUploaded(deedAddress)) {
				return;
			}
			await self.setupDocumentPreview();
			await self.getPurchaseAgreementSigners();
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
		const base64 = await this.convertToBase64(this.selectedDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.SellerDisclosures, this.deedAddress, base64);
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
			await this.smartContractService.signSellerDisclosures(this.deedAddress, requestSignatureId);
		}
	}

	public async getPurchaseAgreementSigners() {
		await this.markBuyerSign();
		await this.markSellerSign();
		await this.markBrokerSign();
	}

	private async markBuyerSign() {
		this.hasBuyerSigned = await this.smartContractService.hasBuyerSellerDisclosuresAgreement(this.deedAddress);
	}

	private async markSellerSign() {
		this.hasSellerSigned = await this.smartContractService.hasSellerSellerDisclosuresAgreement(this.deedAddress);
	}

	private async markBrokerSign() {
		this.hasBrokerSigned = await this.smartContractService.hasBrokerSellerDisclosuresAgreement(this.deedAddress);
	}

}
