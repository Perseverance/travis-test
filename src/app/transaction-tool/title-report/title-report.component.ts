import { DeedDocumentType } from './../enums/deed-document-type.enum';
import { Observable } from 'rxjs/Observable';
import { UserRoleEnum } from './../enums/user-role.enum';
import { Base64Service } from './../../shared/base64.service';
import { HelloSignService } from './../../shared/hello-sign.service';
import { SmartContractConnectionService } from './../../smart-contract-connection/smart-contract-connection.service';
import { TransactionToolDocumentService } from './../transaction-tool-document.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';
import { DeedsService } from '../../shared/deeds.service';

declare const HelloSign;

@Component({
	selector: 'app-title-report',
	templateUrl: './title-report.component.html',
	styleUrls: ['./title-report.component.scss']
})
export class TitleReportComponent implements OnInit {

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
	public previewLink: string;
	private addressSubscription: Subscription;
	public deedAddress: string;
	public hasBuyerSigned: boolean;
	public hasSellerSigned: boolean;

	constructor(private route: ActivatedRoute,
		private documentService: TransactionToolDocumentService,
		private smartContractService: SmartContractConnectionService,
		private helloSignService: HelloSignService,
		private base64Service: Base64Service,
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
			await self.setupDocumentPreview(deedAddress);
			await self.getTitleReportSigners();
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
			if (doc.type === DeedDocumentType.TitleReport) {
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
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.TitleReport, this.deedAddress, base64);
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

	public async getTitleReportSigners() {
		this.hasBuyerSigned = true;
		this.hasSellerSigned = false;
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
