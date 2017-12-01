import {Component, OnInit} from '@angular/core';

@Component({
	selector: 'app-document-preview',
	templateUrl: './document-preview.component.html',
	styleUrls: ['./document-preview.component.scss']
})
export class DocumentPreviewComponent implements OnInit {
	public pdfSrc = {
		url: 'https://s3.amazonaws.com/hellofax_uploads/super_groups/2017/12/01/0d8744da207db01ad70eb8cc48f1076991b371de/merged-initial.pdf?X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIUP3UXZTTZXNQYGQ%2F20171201%2Fus-east-1%2Fs3%2Faws4_request&X-Amz-Date=20171201T124749Z&X-Amz-SignedHeaders=host&X-Amz-Expires=259200&X-Amz-Signature=8e0bad002a8eab089823d9b4d5db62558383cd535d0b54d5d6e1f9583b380eb5',
		withCredentials: true
	};

	constructor() {
	}

	ngOnInit() {
	}

}
