import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {TransactionToolWorkflowService} from '../workflow/workflow.service';
import {DeedDocumentType} from '../enums/deed-document-type.enum';
import {TransactionToolDocumentService} from '../transaction-tool-document.service';
import {PropertiesFilter} from '../../properties/properties.service';
import {InputTextarea} from 'primeng/primeng';

@Component({
	selector: 'app-upload-document',
	templateUrl: './upload-document.component.html',
	styleUrls: ['./upload-document.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class UploadDocumentComponent implements OnInit {
	public selectedDocument: any;
	@Input() uploadTitle: string;
	@Input() uploadSubtitle: string;
	@Output() onUploadDocumentApplied = new EventEmitter<PropertiesFilter>();

	constructor() {
	}

	ngOnInit() {
	}

	public selectFile(event) {
		this.selectedDocument = event.files['0'];
	}

	public removeFile() {
		this.selectedDocument = null;
	}

	public async uploadDocument() {
		if (!this.selectedDocument) {
			return;
		}
		this.onUploadDocumentApplied.emit(this.selectedDocument);
	}
}
