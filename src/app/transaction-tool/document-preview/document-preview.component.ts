import {Component, OnInit} from '@angular/core';
import {TransactionToolDocumentService} from '../transaction-tool-document.service';

@Component({
	selector: 'app-document-preview',
	templateUrl: './document-preview.component.html',
	styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnInit {
	public downloadDocumentLink: string;
	public iframeSrc: string;

	constructor(private documentService: TransactionToolDocumentService) {
	}

	ngOnInit() {
		this.downloadDocumentLink = this.documentService.downloadLink;
		this.iframeSrc = `https://docs.google.com/viewer?url=${this.downloadDocumentLink}&embedded=true`;
	}

}
