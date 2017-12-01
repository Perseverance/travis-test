import {Component, OnInit} from '@angular/core';
import {TransactionToolWorkflowService} from '../workflow/workflow.service';
import {DeedDocumentType} from '../enums/deed-document-type.enum';
import {TransactionToolDocumentService} from '../transaction-tool-document.service';

@Component({
	selector: 'app-upload-document',
	templateUrl: './upload-document.component.html',
	styleUrls: ['./upload-document.component.scss']
})
export class UploadDocumentComponent implements OnInit {
	public selectedDocument: any;

	constructor(private workflowService: TransactionToolWorkflowService,
				private documentService: TransactionToolDocumentService) {
	}

	ngOnInit() {
	}

	public selectFile(event) {
		this.selectedDocument = event.files['0'];
		console.log(event.files['0']);
	}

	public removeFile() {
		this.selectedDocument = null;
	}

	public async uploadDocument() {
		if (this.selectedDocument === undefined || this.selectedDocument === null) {
			return;
		}
		const base64 = await this.convertToBase64(this.selectedDocument);
		const deedContractAddres = this.workflowService.dealDetails.deedContractAddress;
		const response = await this.documentService.uploadTransactionToolDocument(DeedDocumentType.PurchaseAgreement, deedContractAddres, base64);
		this.documentService.downloadLink = response.downloadLink;
	}

	public async convertToBase64(document): Promise<string> {
		const self = this;
		const base64 = await (new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = function () {
				const base64dataWithHeaders = reader.result;

				// The reader normally adds something like this before the base64 - 'data:image/jpeg;base64,'
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
