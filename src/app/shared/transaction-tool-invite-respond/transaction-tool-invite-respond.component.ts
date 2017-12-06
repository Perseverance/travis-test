import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-transaction-tool-invite-respond',
	templateUrl: './transaction-tool-invite-respond.component.html',
	styleUrls: ['./transaction-tool-invite-respond.component.scss']
})
export class TransactionToolInviteRespondComponent implements OnInit {

	@Output() onAccept = new EventEmitter<any>();
	@Output() onReject = new EventEmitter<any>();


	constructor() { }

	ngOnInit() {
	}

	public onAcceptClick() {
		this.onAccept.emit();
	}

	public onRejectClick() {
		this.onAccept.emit();
	}

}
