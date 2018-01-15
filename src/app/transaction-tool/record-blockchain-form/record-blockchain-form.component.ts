import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, Output, EventEmitter, Input } from '@angular/core';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';

@Component({
	selector: 'app-record-blockchain-form',
	templateUrl: './record-blockchain-form.component.html',
	styleUrls: ['./record-blockchain-form.component.scss']
})
export class RecordBlockchainFormComponent extends ErrorsDecoratableComponent implements OnInit {

	public blockchainRecordForm: FormGroup;

	@Output() onRecord = new EventEmitter<string>();
	@Input() buttonRecordEnabled: boolean;

	constructor(private formBuilder: FormBuilder,
		errorsService: ErrorsService,
		translateService: TranslateService, ) {
		super(errorsService, translateService);
		this.blockchainRecordForm = this.formBuilder.group({
			proWalletPassword: [null, [Validators.required]],
		});
	}

	ngOnInit() {
	}

	public get proWalletPassword() {
		return this.blockchainRecordForm.get('proWalletPassword');
	}

	@DefaultAsyncAPIErrorHandling('settings.set-pro-address.could-not-set-address')
	public async onSubmit() {
		this.onRecord.emit(this.proWalletPassword.value);
	}

}
