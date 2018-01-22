import {GoogleAnalyticsEventsService} from './../../shared/google-analytics.service';
import {Subscription} from 'rxjs/Subscription';
import {UserData} from './../../authentication/authentication.service';
import {NotificationsService} from './../../shared/notifications/notifications.service';
import {PropertiesService} from './../properties.service';
import {PhoneNumberValidators} from './../../shared/validators/phone-number.validators';
import {ErrorsDecoratableComponent} from './../../shared/errors/errors.decoratable.component';
import {TranslateService} from '@ngx-translate/core';
import {ErrorsService} from './../../shared/errors/errors.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Component, OnInit, Input, ViewEncapsulation, ViewChild} from '@angular/core';
import {DefaultAsyncAPIErrorHandling} from '../../shared/errors/errors.decorators';
import {AuthenticationService} from '../../authentication/authentication.service';
import {OnDestroy} from '@angular/core/src/metadata/lifecycle_hooks';
import {IntPhonePrefixComponent} from 'ng4-intl-phone/src/lib';

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
	public phoneMaxLengthWithPlusSign = 21;

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
				Validators.minLength(4),
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
				this.phoneNumber.setValue(userInfo.user.phoneNumber);
				if (!userInfo.user.phoneNumber) {
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
		this.phoneNumber.setValidators(Validators.maxLength(this.phoneMaxLengthWithPlusSign));
		await this.propertiesService.requestInfo(
			this.propertyId,
			this.agentId.value,
			this.name.value,
			this.email.value,
			phoneNumber,
			this.message.value);
		this.message.reset();
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
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

		phoneNumber = this.phoneNumber.value === this.userInfo.user.phoneNumber ?
			this.userInfo.user.phoneNumber : `+${this.childPhoneComponent.selectedCountry.dialCode}${this.phoneNumber.value}`;

		return phoneNumber;
	}

	public handlePhoneInputChanged() {
		this.phoneNumber.setValidators(Validators.maxLength(this.phoneMaxLengthWithPlusSign - (this.childPhoneComponent.selectedCountry.dialCode.length + 1)));
	}
}
