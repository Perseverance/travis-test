import { NotificationsService } from './../../shared/notifications/notifications.service';
import { Base64Service } from './../../shared/base64.service';
import { DeedsService } from './../../shared/deeds.service';
import { HelloSignService } from './../../shared/hello-sign.service';
import { SmartContractConnectionService } from './../../smart-contract-connection/smart-contract-connection.service';
import { TransactionToolDocumentService } from './../transaction-tool-document.service';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { DeedDocumentType } from './../enums/deed-document-type.enum';
import { Component, OnInit } from '@angular/core';
import { UserRoleEnum } from '../enums/user-role.enum';


@Component({
	selector: 'app-closing-documents',
	templateUrl: './closing-documents.component.html',
	styleUrls: ['./closing-documents.component.scss']
})
export class ClosingDocumentsComponent implements OnInit {
	public deedDocumentTypeEnum = DeedDocumentType;
	public userInfo: any;
	public userIsTitleCompany: boolean;
	public userIsBuyer: boolean;


	public selectedDocument: any;
	public previewLink: string;
	private addressSubscription: Subscription;
	public deedAddress: string;
	public closeTitle = 'Closing Document';
	public uploadCloseSubtitle = 'Please upload closing document:';
	public previewCloseSubtitle = 'Please review closing document.';
	public successMessage = 'Success!';

	constructor(private route: ActivatedRoute,
		private documentService: TransactionToolDocumentService,
		private smartContractService: SmartContractConnectionService,
		private deedsService: DeedsService,
		private base64Service: Base64Service,
		private notificationService: NotificationsService) { }

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
		});
	}

	private async setupDocumentPreview(deedId: string) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		this.previewLink = this.getSignatureRequestId(deed.documents);
	}

	private getSignatureRequestId(documents: any[]) {
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.ClosingDocuments) {
				return doc.uniqueId;
			}
		}
	}

	public async uploadDocument(event: any) {
		this.selectedDocument = event;

		if (!this.selectedDocument) {
			return;
		}
		this.notificationService.pushInfo({
			title: `Please wait. A document is uploading, so be patient.`,
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		const base64 = await this.base64Service.convertFileToBase64(this.selectedDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.ClosingDocuments, this.deedAddress, base64);
		this.previewLink = response.uniqueId;
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	private async mapCurrentUserToRole(deedAddress) {
		const deed = await this.deedsService.getDeedDetails(deedAddress);
		this.userIsTitleCompany = (deed.currentUserRole === UserRoleEnum.TitleCompany);
		this.userIsBuyer = (deed.currentUserRole === UserRoleEnum.Buyer);

	}

}
