import { GoogleAnalyticsEventsService } from './../../shared/google-analytics.service';
import { Subscription } from 'rxjs/Subscription';
import { UserData } from './../../authentication/authentication.service';
import { NotificationsService } from './../../shared/notifications/notifications.service';
import { PropertiesService } from './../properties.service';
import { PhoneNumberValidators } from './../../shared/validators/phone-number.validators';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewEncapsulation, ViewChild } from '@angular/core';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { AuthenticationService } from '../../authentication/authentication.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { IntPhonePrefixComponent } from 'ng4-intl-phone/src/lib';
import { Country } from '../../shared/country.interface';

@Component({
	selector: 'app-contact-agent',
	templateUrl: './contact-agent.component.html',
	styleUrls: ['./contact-agent.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ContactAgentComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	public contactAgentForm: FormGroup;
	private successMessage: string;
	private userDataSubscription: Subscription;
	public defaultPhoneCountryCode: string;
	public userInfo: any;
	public phoneMinLength = 4;
	public phoneMaxLengthWithPlusSign = 21;
	public userPhoneCountry: any;

	@Input() agents: any[];
	@Input() propertyId: string;
	@ViewChild(IntPhonePrefixComponent) childPhoneComponent: IntPhonePrefixComponent;

	constructor(private propertiesService: PropertiesService,
	            private authService: AuthenticationService,
	            private formBuilder: FormBuilder,
	            private notificationService: NotificationsService,
	            errorsService: ErrorsService,
	            translateService: TranslateService,
	            public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
		super(errorsService, translateService);

		this.contactAgentForm = this.formBuilder.group({
			name: ['', [Validators.required]],
			phoneNumber: ['', Validators.compose([
				Validators.required,
				PhoneNumberValidators.phoneNumberValidator,
				Validators.minLength(this.phoneMinLength),
				Validators.maxLength(this.phoneMaxLengthWithPlusSign)])
			],
			email: ['', [Validators.required, Validators.email]],
			message: ['', [Validators.required]],
			agentId: [undefined, [Validators.required]]
		});

		this.userDataSubscription = this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				this.userInfo = userInfo;
				if (userInfo.isAnonymous) {
					this.defaultPhoneCountryCode = 'us';
					return;
				}
				this.name.setValue(`${userInfo.user.firstName} ${userInfo.user.lastName}`);
				this.userPhoneCountry = this.userInfo.user.phoneCountryCode;
				this.phoneNumber.setValue(userInfo.user.phoneNumber);
				if (!userInfo.user.phoneNumber || (userInfo.user.phoneNumber && this.phoneNumber.invalid && this.phoneNumber.errors['invalidPhoneNumber'])) {
					this.defaultPhoneCountryCode = 'us';
				}
				this.email.setValue(userInfo.user.email);
			}
		});

	}

	ngOnInit() {
		this.translateService.stream('property-details.contact-agent.contact-success').subscribe(value => {
			this.successMessage = value;
		});

		this.agentId.setValue(this.agents[0].id);
	}

	ngOnDestroy(): void {
		this.userDataSubscription.unsubscribe();
	}

	public get name() {
		return this.contactAgentForm.get('name');
	}

	public get phoneNumber() {
		return this.contactAgentForm.get('phoneNumber');
	}

	public get email() {
		return this.contactAgentForm.get('email');
	}

	public get message() {
		return this.contactAgentForm.get('message');
	}

	public get agentId() {
		return this.contactAgentForm.get('agentId');
	}

	public emitContactAgentAnalyticsClickEvent() {
		this.googleAnalyticsEventsService.emitEvent('page-contact', this.propertyId);
	}

	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async onSubmit() {
		const phoneNumber = this.handlePhoneNumber();
		this.phoneNumber.setValidators(Validators.compose([
			Validators.required,
			PhoneNumberValidators.phoneNumberValidator,
			Validators.minLength(this.phoneMinLength),
			Validators.maxLength(this.phoneMaxLengthWithPlusSign)]));
		await this.propertiesService.requestInfo(
			this.propertyId,
			this.agentId.value,
			this.name.value,
			this.email.value,
			phoneNumber,
			this.childPhoneComponent.selectedCountry.countryCode,
			this.message.value);
		this.message.reset();
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
		this.googleAnalyticsEventsService.emitEvent('click', 'contact_seller_submission');
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

		phoneNumber = this.phoneNumber.value === this.userInfo.user.phoneNumber ?
			this.userInfo.user.phoneNumber : `+${this.childPhoneComponent.selectedCountry.dialCode}${this.phoneNumber.value}`;

		return phoneNumber;
	}

	public handlePhoneInputChanged() {
		if (this.childPhoneComponent && this.childPhoneComponent.selectedCountry) {
			this.phoneNumber.setValidators(Validators.compose([
				Validators.required,
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
