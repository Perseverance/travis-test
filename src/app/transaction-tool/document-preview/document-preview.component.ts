import {Component, Input, OnChanges, OnInit} from '@angular/core';
import {TransactionToolDocumentService} from '../transaction-tool-document.service';

@Component({
	selector: 'app-document-preview',
	templateUrl: './document-preview.component.html',
	styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnInit, OnChanges {
	public iframeSrc: string;
	@Input() downloadDocumentLink: string;


	constructor() {
	}

	ngOnInit() {
	}

	ngOnChanges() {
		this.iframeSrc = `https://docs.google.com/viewer?url=${this.downloadDocumentLink}&embedded=true`;
	}
}
