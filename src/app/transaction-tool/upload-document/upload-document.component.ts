import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {PropertiesFilter} from '../../properties/properties.service';

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
