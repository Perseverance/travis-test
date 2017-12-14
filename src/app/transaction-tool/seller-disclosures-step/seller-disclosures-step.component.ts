import {HelloSignService} from './../../shared/hello-sign.service';
import {DeedDocumentType} from './../enums/deed-document-type.enum';
import {Observable} from 'rxjs/Observable';
import {UserRoleEnum} from './../enums/user-role.enum';
import {SmartContractConnectionService} from './../../smart-contract-connection/smart-contract-connection.service';
import {ActivatedRoute} from '@angular/router';
import {TransactionToolDocumentService} from './../transaction-tool-document.service';
import {AuthenticationService, UserData} from './../../authentication/authentication.service';
import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit} from '@angular/core';
import {Base64Service} from '../../shared/base64.service';
import {DeedsService} from '../../shared/deeds.service';

declare const HelloSign;

@Component({
	selector: 'app-seller-disclosures-step',
	templateUrl: './seller-disclosures-step.component.html',
	styleUrls: ['./seller-disclosures-step.component.scss']
})
export class SellerDisclosuresStepComponent implements OnInit {

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
	public deedAddress: string;
	public hasBuyerSigned: boolean;
	public hasSellerSigned: boolean;
	public hasBuyerBrokerSigned: boolean;
	public hasSellerBrokerSigned: boolean;

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
			if (!await self.smartContractService.isPurchaseAgreementUploaded(deedAddress)) {
				return;
			}
			await self.setupDocumentPreview(deedAddress);
			await self.getSellerDisclosuresSigners();
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
			if (doc.type === DeedDocumentType.SignedSellerDisclosures) {
				return doc.uniqueId;
			}
		}
	}

	public async signDocument() {
		const deed = await this.deedsService.getDeedDetails(this.deedAddress);
		const requestSignatureId = this.getSignatureRequestId(deed.documents);
		const response = await this.documentService.getSignUrl(requestSignatureId);
		const signingEvent = await this.helloSignService.signDocument(response);
		if (signingEvent === HelloSign.EVENT_SIGNED) {
			await this.smartContractService.signPurchaseAgreement(this.deedAddress, requestSignatureId);
			setTimeout(async () => {
				// Workaround: waiting HelloSign to update new signature
				await this.setupDocumentPreview(this.deedAddress);
			}, this.helloSignService.SignatureUpdatingTimeoutInMilliseconds);
		}
	}

	public async getSellerDisclosuresSigners() {
		// ToDo: get from backend
		await this.markBuyerSign();
		await this.markSellerSign();
		await this.markBuyerBrokerSign();
		await this.markSellerBrokerSign();
	}

	private async markBuyerSign() {
		this.hasBuyerSigned = false;
	}

	private async markSellerSign() {
		this.hasSellerSigned = true;
	}

	private async markBuyerBrokerSign() {
		this.hasBuyerBrokerSigned = false;
	}

	private async markSellerBrokerSign() {
		this.hasSellerBrokerSigned = false;
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
