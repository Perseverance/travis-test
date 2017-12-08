import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
	selector: 'app-sign-document',
	templateUrl: './sign-document.component.html',
	styleUrls: ['./sign-document.component.scss']
})
export class SignDocumentComponent implements OnInit {
	@Input() buyerIsParticipant = false;
	@Input() sellerIsParticipant = false;
	@Input() brokerIsParticipant = false;
	@Input() escrowIsParticipant = false;
	@Input() hasBuyerSigned: boolean;
	@Input() hasSellerSigned: boolean;
	@Input() hasBrokerSigned: boolean;
	@Input() hasEscrowSigned: boolean;
	@Input() signButtonLabel: string;
	@Input() showSignButton: boolean;
	@Output() onSignDocument = new EventEmitter<any>();

	constructor() {
	}

	ngOnInit() {
	}

	public onSignDocumentClick() {
		this.onSignDocument.emit();
	}
}
