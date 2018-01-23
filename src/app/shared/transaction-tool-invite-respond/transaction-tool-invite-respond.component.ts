import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
	selector: 'app-transaction-tool-invite-respond',
	templateUrl: './transaction-tool-invite-respond.component.html',
	styleUrls: ['./transaction-tool-invite-respond.component.scss']
})
export class TransactionToolInviteRespondComponent implements OnInit {

	@Output() onAccept = new EventEmitter<any>();
	@Output() onReject = new EventEmitter<any>();

	public rejectForm: FormGroup;
	public rejectTouched = false;

	constructor(private formBuilder: FormBuilder) { }

	ngOnInit() {

		this.rejectForm = this.formBuilder.group({
			reason: ['', [Validators.required, Validators.minLength(8)]]
		});
	}

	public get reason() {
		return this.rejectForm.get('reason');
	}

	public onAcceptClick() {
		this.onAccept.emit();
	}

	public onRejectClick() {
		this.rejectTouched = true;
		if (this.rejectForm.invalid) {
			return;
		}
		this.onReject.emit(this.reason.value);
		this.rejectTouched = false;
	}

}
