import { environment } from './../../../environments/environment';
import { DeedDocumentType } from './../enums/deed-document-type.enum';
import { Observable } from 'rxjs/Observable';
import { UserRoleEnum } from './../enums/user-role.enum';
import { Base64Service } from './../../shared/base64.service';
import { HelloSignService } from './../../shared/hello-sign.service';
import {
	SmartContractConnectionService,
	Status
} from './../../smart-contract-connection/smart-contract-connection.service';
import { TransactionToolDocumentService } from './../transaction-tool-document.service';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { Component, OnInit } from '@angular/core';
import { DeedsService } from '../../shared/deeds.service';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { NotificationsService } from '../../shared/notifications/notifications.service';
import { ErrorsDecoratableComponent } from '../../shared/errors/errors.decoratable.component';
import { ErrorsService } from '../../shared/errors/errors.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
	selector: 'app-transfer-ownership',
	templateUrl: './transfer-ownership.component.html',
	styleUrls: ['./transfer-ownership.component.scss']
})
export class TransferOwnershipComponent extends ErrorsDecoratableComponent implements OnInit {

	public successMessage = 'Success!';

	public deedDocumentTypeEnum = DeedDocumentType;
	public userInfo: any;
	public userIsTitleCompany: boolean;
	private addressSubscription: Subscription;
	public deedId: string;
	public hasDataLoaded = false;
	public signingDocument: any;
	public isTransferFinished = false;
	private deedAddress: string;
	public txHash: string;
	public buttonRecordEnabled = true;

	constructor(private route: ActivatedRoute,
		private documentService: TransactionToolDocumentService,
		private smartContractService: SmartContractConnectionService,
		private deedsService: DeedsService,
		private notificationService: NotificationsService,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);
	}

	async ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedId) {
			if (!deedId) {
				throw new Error('No deed address supplied');
			}
			self.deedId = deedId;
			await self.mapCurrentUserToRole(deedId);
			await self.setupDocument(deedId);
			self.hasDataLoaded = true;
		});
	}

	private async setupDocument(deedId: string) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		this.signingDocument = this.getSignatureDocument(deed.documents);
		this.isTransferFinished = (deed.status == Status.transferred);
		this.deedAddress = deed.deedContractAddress;
	}

	private getSignatureDocument(documents: any[]) {
		for (const doc of documents) {
			if (doc.type === DeedDocumentType.ClosingDocuments) {
				return doc;
			}
		}
	}

	// TODO change message
	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async onRecordClick(password) {
		this.buttonRecordEnabled = false;
		try {
			this.notificationService.pushInfo({
				title: `Sending the document to the blockchain.`,
				message: '',
				time: (new Date().getTime()),
				timeout: 60000
			});
			const documentString = await this.documentService.getDocumentContent(this.signingDocument.id);
			let result;
			try {
				result = await this.smartContractService.recordOwnershipTransfer(password, this.deedAddress, documentString);
			} catch (e) {
				this.errorsService.pushError({
					errorTitle: '',
					errorMessage: e.message,
					errorTime: (new Date()).getTime()
				});
				this.buttonRecordEnabled = true;
			}
			if (result.status === '0x0') {
				throw new Error('Could not save to the blockchain. Try Again');
			}
			this.txHash = `${environment.rinkebyTxLink}${result.transactionHash}`;
			this.notificationService.pushInfo({
				title: `Sending the document to the backend.`,
				message: '',
				time: (new Date().getTime()),
				timeout: 10000
			});
			await this.deedsService.sendDocumentTxHash(this.signingDocument.id, result.transactionHash);
			this.notificationService.pushSuccess({
				title: 'Successfully Sent',
				message: '',
				time: (new Date().getTime()),
				timeout: 4000
			});
		} catch (err) {
			this.buttonRecordEnabled = true;
			throw err;
		}
	}

	private async mapCurrentUserToRole(deedAddress) {
		const deed = await this.deedsService.getDeedDetails(deedAddress);
		this.userIsTitleCompany = (deed.currentUserRole === UserRoleEnum.TitleCompany);
	}
}
