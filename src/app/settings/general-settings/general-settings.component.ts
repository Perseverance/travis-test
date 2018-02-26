import { VerificationService } from './../../verification/verification.service';
import { NotificationsService } from './../../shared/notifications/notifications.service';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import {
	Component, EventEmitter, Input, OnInit, Output, ViewChild,
	ViewEncapsulation
} from '@angular/core';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { IntPhonePrefixComponent } from 'ng4-intl-phone/src/lib';
import { PhoneNumberValidators } from '../../shared/validators/phone-number.validators';

@Component({
	selector: 'app-general-settings',
	templateUrl: './general-settings.component.html',
	styleUrls: ['./general-settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GeneralSettingsComponent extends ErrorsDecoratableComponent implements OnInit {

	public editProfileForm: FormGroup;
	public successMessage: string;
	public defaultPhoneCountryCode: string;
	public isEmailVerified: boolean;
	private resendSuccess: string;
	public verificationTouched = false;
	public hasUserDataLoaded = false;
	public phoneMinLength = 4;
	public phoneMaxLengthWithPlusSign = 21;

	private userInfo: any;
	// ToDo: Get from userInfo and remove mocked one below
	public userPhoneCountry: any;
	@ViewChild(IntPhonePrefixComponent) childPhoneComponent: IntPhonePrefixComponent;
	@Input() generalTabIsActive = false;

	// private mockedSelectedCountry = {
	// 	name: '',
	// 	dialCode: '1',
	// 	countryCode: 'ca'
	// };

	constructor(private authService: AuthenticationService,
	            private formBuilder: FormBuilder,
	            private notificationService: NotificationsService,
	            private verificationService: VerificationService,
	            errorsService: ErrorsService,
	            translateService: TranslateService) {
		super(errorsService, translateService);

		this.editProfileForm = this.formBuilder.group({
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]],
			email: [{value: ''}, [Validators.required, Validators.email]],
			phoneNumber: ['', Validators.compose([
				PhoneNumberValidators.phoneNumberValidator,
				Validators.minLength(this.phoneMinLength),
				Validators.maxLength(this.phoneMaxLengthWithPlusSign)])
			]
		});
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.isAnonymous) {
					this.defaultPhoneCountryCode = 'us';
					return;
				}
				this.userInfo = userInfo.user;
				this.isEmailVerified = this.userInfo.isEmailVerified;
				this.userPhoneCountry = this.userInfo.phoneCountryCode;
				this.setUserInfo(this.userInfo);
				if (!userInfo.user.phoneNumber || (userInfo.user.phoneNumber
						&& this.phoneNumber.invalid &&
						this.phoneNumber.errors['invalidPhoneNumber'])) {
					this.defaultPhoneCountryCode = 'us';
				}

				this.hasUserDataLoaded = true;
			}
		});
	}

	ngOnInit() {
		this.translateService.stream(['settings.general-settings.update-success', 'verification.resend-success']).subscribe(translations => {
			this.successMessage = translations['settings.general-settings.update-success'];
			this.resendSuccess = translations['verification.resend-success'];
		});
	}

	public setUserInfo(userInfo: any, cancel = false) {
		this.firstName.setValue(userInfo.firstName);
		this.lastName.setValue(userInfo.lastName);
		if (userInfo.phoneNumber || cancel) {
			this.phoneNumber.setValue(userInfo.phoneNumber);
		}
		this.email.setValue(userInfo.email);
	}

	public get firstName() {
		return this.editProfileForm.get('firstName');
	}

	public get lastName() {
		return this.editProfileForm.get('lastName');
	}

	public get email() {
		return this.editProfileForm.get('email');
	}

	public get phoneNumber() {
		return this.editProfileForm.get('phoneNumber');
	}

	@DefaultAsyncAPIErrorHandling('settings.general-settings')
	public async editUser() {
		const phoneNumber = this.handlePhoneNumber();
		this.phoneNumber.setValidators(Validators.compose([
			PhoneNumberValidators.phoneNumberValidator,
			Validators.minLength(this.phoneMinLength),
			Validators.maxLength(this.phoneMaxLengthWithPlusSign)]));
		if (!!this.firstName.value.trim().length && !!this.lastName.value.trim().length) {
			await this.authService.updateUser(this.email.value, this.firstName.value.trim(), this.lastName.value.trim(), phoneNumber, this.childPhoneComponent.selectedCountry.countryCode);
			this.notificationService.pushSuccess({
				title: this.successMessage,
				message: '',
				time: (new Date().getTime()),
				timeout: 4000
			});
		} else {
			this.notificationService.pushInfo({
				title: 'ERROR: ',
				message: 'Please enter valid First name and/or Last name',
				time: (new Date().getTime()),
				timeout: 3000
			});
		}
	}

	public cancelEdit() {
		this.phoneNumber.setValidators(Validators.compose([
			PhoneNumberValidators.phoneNumberValidator,
			Validators.minLength(this.phoneMinLength),
			Validators.maxLength(this.phoneMaxLengthWithPlusSign)]));
		this.setUserInfo(this.userInfo, true);
	}

	@DefaultAsyncAPIErrorHandling('verification.resend-error')
	public async resendVerification() {
		this.verificationTouched = true;
		if (this.email.invalid) {
			return;
		}
		await this.verificationService.resendVerficiation(this.email.value);
		this.notificationService.pushSuccess({
			title: this.resendSuccess,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});

		this.verificationTouched = false;
	}

	public updateControlAsTouched() {
		this.phoneNumber.markAsTouched();
	}

	public activatePhoneDropDown() {
		this.childPhoneComponent.showDropDown();
	}

	public handlePhoneNumber(): string {
		let phoneNumber;

		if (!this.phoneNumber.value) {
			return '';
		}

		if (this.phoneNumber.value.startsWith('+')) {
			return this.phoneNumber.value;
		}

		phoneNumber = this.phoneNumber.value === this.userInfo.phoneNumber ?
			this.userInfo.phoneNumber : `+${this.childPhoneComponent.selectedCountry.dialCode}${this.phoneNumber.value}`;

		return phoneNumber;
	}

	public handlePhoneInputChanged() {
		if (this.childPhoneComponent && this.childPhoneComponent.selectedCountry) {
			this.phoneNumber.setValidators(Validators.compose([
				PhoneNumberValidators.phoneNumberValidator,
				Validators.minLength(this.phoneMinLength),
				Validators.maxLength(this.phoneMaxLengthWithPlusSign - (this.childPhoneComponent.selectedCountry.dialCode.length + 1))]));

		}
	}

	public handleSelectedCountryChanged() {
		if (this.childPhoneComponent && this.childPhoneComponent.selectedCountry) {
			this.phoneNumber.setValidators(Validators.compose([
				PhoneNumberValidators.phoneNumberValidator,
				Validators.minLength(this.phoneMinLength),
				Validators.maxLength(this.phoneMaxLengthWithPlusSign)]));
			this.phoneNumber.setValue(`+${this.childPhoneComponent.selectedCountry.dialCode}${this.phoneNumber.value}`);
		}
	}
}
