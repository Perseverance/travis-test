import {DeedDocumentType} from './../enums/deed-document-type.enum';
import {Observable} from 'rxjs/Observable';
import {UserRoleEnum} from './../enums/user-role.enum';
import {Base64Service} from './../../shared/base64.service';
import {HelloSignService} from './../../shared/hello-sign.service';
import {SmartContractConnectionService} from './../../smart-contract-connection/smart-contract-connection.service';
import {TransactionToolDocumentService} from './../transaction-tool-document.service';
import {ActivatedRoute} from '@angular/router';
import {AuthenticationService, UserData} from './../../authentication/authentication.service';
import {Subscription} from 'rxjs/Subscription';
import {Component, OnInit} from '@angular/core';

declare const HelloSign;

@Component({
	selector: 'app-settlement-statement-step',
	templateUrl: './settlement-statement-step.component.html',
	styleUrls: ['./settlement-statement-step.component.scss']
})
export class SettlementStatementStepComponent implements OnInit {

	public waitingTitle = 'Waiting to upload settlement statement';
	public settlementTitle = 'Settlement Statement';
	public uploadSettlementSubtitle = 'Please upload settlement statement document:';
	public previewSettlementSubtitle = 'Please review and sign settlement statement.';

	public userInfo: any;
	public userIsBuyer: boolean;
	public userIsSeller: boolean;
	public userIsEscrow: boolean;
	public userIsBroker: boolean;
	public selectedDocument: any;
	public previewLink: string;
	private addressSubscription: Subscription;
	public deedAddress: string;
	public hasBuyerSigned: boolean;
	public hasSellerSigned: boolean;
	public hasBrokerSigned: boolean;
	public hasEscrowSigned: boolean;
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
				this.userIsBroker = (userInfo.user.role === UserRoleEnum.Agent);
				this.userIsBuyer = (userInfo.user.role === UserRoleEnum.Buyer);
				this.userIsEscrow = (userInfo.user.role === UserRoleEnum.Escrow);
				this.userIsSeller = (userInfo.user.role === UserRoleEnum.Seller);
			}
		});
	}

	async ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedAddress) {
			if (!deedAddress) {
				throw new Error('No deed address supplied');
			}
			self.deedAddress = deedAddress;
			if (!await self.smartContractService.isSettlementStatementUploaded(deedAddress)) {
				return;
			}
			await self.setupDocumentPreview();
			await self.getSettlementStatementSigners();
		});
	}

	private async setupDocumentPreview() {
		const requestSignatureId = await this.smartContractService.getSettlementStatementSignatureRequestId(this.deedAddress);
		this.previewLink = await this.documentService.getPreviewDocumentLink(requestSignatureId);
	}

	public async uploadDocument(event: any) {
		this.selectedDocument = event;

		if (!this.selectedDocument) {
			return;
		}
		const base64 = await this.base64Service.convertFileToBase64(this.selectedDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.SettlementStatement, this.deedAddress, base64);
		this.previewLink = response.downloadLink;
	}


	public async signDocument() {
		const requestSignatureId = await this.smartContractService.getSettlementStatementSignatureRequestId(this.deedAddress);
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

	public async getSettlementStatementSigners() {
		this.hasBuyerSigned = await this.smartContractService.hasBuyerSignedClosingDocuments(this.deedAddress);
		this.hasSellerSigned = await this.smartContractService.hasSellerSignedClosingDocuments(this.deedAddress);
		this.hasBrokerSigned = await this.smartContractService.hasBrokerSignedClosingDocuments(this.deedAddress);
		this.hasEscrowSigned = await this.smartContractService.hasEscrowSignedClosingDocuments(this.deedAddress);
	}

	public shouldShowSignButton(): boolean {
		return (this.userIsBuyer && !this.hasBuyerSigned)
			|| (this.userIsSeller && !this.hasSellerSigned)
			|| (this.userIsEscrow && !this.hasEscrowSigned)
			|| (this.userIsBroker && !this.hasBrokerSigned);
	}

}
