import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserData} from '../../authentication/authentication.service';
import {UserRoleEnum} from '../enums/user-role.enum';
import {TransactionToolWorkflowService} from '../workflow/workflow.service';
import {TransactionToolDocumentService} from '../transaction-tool-document.service';
import {DeedDocumentType} from '../enums/deed-document-type.enum';
import {Observable} from 'rxjs/Observable';
import {ActivatedRoute} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';

@Component({
	selector: 'app-purchase-agreement-step',
	templateUrl: './purchase-agreement-step.component.html',
	styleUrls: ['./purchase-agreement-step.component.scss']
})
export class PurchaseAgreementStepComponent implements OnInit {
	public userInfo: any;
	public userIsAgent = false;
	public selectedDocument: any;
	public downloadLink: string;
	private addressSubscription: Subscription;
	public deedAddress: string;

	constructor(private authService: AuthenticationService,
				private route: ActivatedRoute,
				private documentService: TransactionToolDocumentService) {
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
				this.userIsAgent = (userInfo.user.role === UserRoleEnum.Agent);
			}
		});
	}

	ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedAddress) {
			if (!deedAddress) {
				throw new Error('No deed address supplied');
			}
			self.deedAddress = deedAddress;
		});
	}

	public async uploadDocument(event: any) {
		this.selectedDocument = event;

		if (!this.selectedDocument) {
			return;
		}
		const base64 = await this.convertToBase64(this.selectedDocument);
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.PurchaseAgreement, this.deedAddress, base64);
		this.downloadLink = response.downloadLink;
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
}
