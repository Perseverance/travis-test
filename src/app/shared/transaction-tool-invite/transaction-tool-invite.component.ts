import { ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-transaction-tool-invite',
	templateUrl: './transaction-tool-invite.component.html',
	styleUrls: ['./transaction-tool-invite.component.scss']
})
export class TransactionToolInviteComponent implements OnInit {

	@Output() onInvite = new EventEmitter<any>();

	public inviteForm: FormGroup;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute) {

		this.inviteForm = this.formBuilder.group({
			email: ['', [Validators.required]]
		});

	}

	public get email() {
		return this.inviteForm.get('email');
	}

	ngOnInit() { }

	public inviteSeller() {
		this.onInvite.emit({ email: this.email.value });
	}

}
