import { NotificationsService } from './../../shared/notifications/notifications.service';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { PhoneNumberValidators } from './../../shared/validators/phone-number.validators';
import { SignUpFormValidators } from './../../authentication/sign-up-component/sign-up-components.validators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';

@Component({
	selector: 'app-general-settings',
	templateUrl: './general-settings.component.html',
	styleUrls: ['./general-settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GeneralSettingsComponent extends ErrorsDecoratableComponent implements OnInit {

	public editProfileForm: FormGroup;
	public successMessage: string;

	private userInfo: any;

	constructor(private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private notificationService: NotificationsService,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);
	}

	ngOnInit() {

		this.translateService.stream('settings.general-settings.update-success').subscribe(value => {
			this.successMessage = value;
		});

		this.editProfileForm = this.formBuilder.group({
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]],
			phoneNumber: ['', [Validators.required, PhoneNumberValidators.phoneNumberValidator]],
		});

		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				this.userInfo = userInfo.user;
				this.setUserInfo(this.userInfo);
			}
		});
	}

	private setUserInfo(userInfo: any) {
		this.firstName.setValue(userInfo.firstName);
		this.lastName.setValue(userInfo.lastName);
		this.phoneNumber.setValue(userInfo.phoneNumber);
	}

	public get firstName() {
		return this.editProfileForm.get('firstName');
	}

	public get lastName() {
		return this.editProfileForm.get('lastName');
	}

	public get phoneNumber() {
		return this.editProfileForm.get('phoneNumber');
	}

	@DefaultAsyncAPIErrorHandling('settings.general-settings')
	public async editUser() {
		await this.authService.updateUser(this.firstName.value, this.lastName.value, this.phoneNumber.value);
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	public cancelEdit() {
		this.setUserInfo(this.userInfo);
	}

}
