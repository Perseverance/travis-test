import { TranslateService } from '@ngx-translate/core';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { ErrorsService } from './../../shared/errors/errors.service';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { AuthenticationService } from '../authentication.service';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';

@Component({
	selector: 'app-forgot-password',
	templateUrl: './forgot-password.component.html',
	styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent extends ErrorsDecoratableComponent implements OnInit {
	public isResetRequest = false;
	public forgotForm: FormGroup;

	constructor(private formBuilder: FormBuilder,
		errorsService: ErrorsService,
		translateService: TranslateService,
		private authService: AuthenticationService) {
		super(errorsService, translateService);
		this.forgotForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]]
		});
	}
	ngOnInit() {
	}
	public get email() {
		return this.forgotForm.get('email');
	}
	@DefaultAsyncAPIErrorHandling('forgot-password.reset-password-fail')
	public async onSubmit() {
		const result = await this.authService.forgotPassword(this.email.value);
		this.isResetRequest = true;
	}

}
