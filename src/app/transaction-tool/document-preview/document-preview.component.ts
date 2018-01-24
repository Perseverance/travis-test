import {Component, Input, OnChanges, OnInit} from '@angular/core';

@Component({
	selector: 'app-document-preview',
	templateUrl: './document-preview.component.html',
	styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnInit, OnChanges {
	public iframeSrc: string;
	public signatureDelayNotes = 'Your document will be updated shortly.';

	@Input() previewTitle: string;
	@Input() previewSubtitle: string;
	@Input() previewLink: string;
	@Input() showSignatureDelayNotes = false;


	constructor() {
	}

	ngOnInit() {
	}

	ngOnChanges() {
		this.iframeSrc = `https://docs.google.com/viewer?url=${this.previewLink}&embedded=true`;
	}
}
