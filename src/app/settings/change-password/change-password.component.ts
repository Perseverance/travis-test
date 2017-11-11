import { ErrorsService } from './../../shared/errors/errors.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { DefaultAsyncAPIErrorHandling } from './../../shared/errors/errors.decorators';
import { AuthenticationService } from './../../authentication/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SignUpFormValidators } from './../../authentication/sign-up-component/sign-up-components.validators';
import { NotificationsService } from './../../shared/notifications/notifications.service';

@Component({
	selector: 'app-change-password',
	templateUrl: './change-password.component.html',
	styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	public changePasswordForm: FormGroup;
	public successMessage: string;

	constructor(private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private notificationService: NotificationsService,
		errorsService: ErrorsService,
		translateService: TranslateService) {

		super(errorsService, translateService);

		this.changePasswordForm = this.formBuilder.group({
			passwords: this.formBuilder.group({
				currentPassword: ['', [Validators.required]],
				password: ['', [Validators.required, SignUpFormValidators.passwordSymbolsValidator]],
				repeatPassword: ['', [Validators.required, SignUpFormValidators.passwordSymbolsValidator]]
			}, { validator: SignUpFormValidators.differentPasswordsValidator })
		});
	}

	ngOnInit() {
		this.translateService.stream('settings.password-settings.new-password-success').subscribe(value => {
			this.successMessage = value;
		});
	}

	ngOnDestroy() {
	}

	public get passwords() {
		return this.changePasswordForm.get('passwords');
	}

	public get currentPassword() {
		return this.passwords.get('currentPassword');
	}

	public get password() {
		return this.passwords.get('password');
	}

	public get repeatPassword() {
		return this.passwords.get('repeatPassword');
	}

	@DefaultAsyncAPIErrorHandling('settings.headers.password-settings', 'settings.password-settings.new-password-fail')
	public async changePassword() {
		const currentPassword = this.currentPassword.value;
		const newPassword = this.password.value;
		this.changePasswordForm.reset();
		await this.authService.changePassword(currentPassword, newPassword);
		this.notificationService.pushSuccess({
			title: 'Success',
			message: this.successMessage,
			time: (new Date().getTime()),
			timeout: 4000
		});
	}
}
