import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
	selector: 'app-sign-document',
	templateUrl: './sign-document.component.html',
	styleUrls: ['./sign-document.component.scss']
})
export class SignDocumentComponent implements OnInit {
	@Input() hasBuyerSigned: boolean;
	@Input() hasSellerSigned: boolean;
	@Input() hasBrokerSigned: boolean;
	@Input() signButtonLabel: string;
	@Output() onSignDocument = new EventEmitter<any>();

	constructor() {
	}

	ngOnInit() {
	}

	public onSignDocumentClick() {
		this.onSignDocument.emit();
	}
}
