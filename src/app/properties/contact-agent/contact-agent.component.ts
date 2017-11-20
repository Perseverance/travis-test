import { UserData } from './../../authentication/authentication.service';
import { NotificationsService } from './../../shared/notifications/notifications.service';
import { PropertiesService } from './../properties.service';
import { PhoneNumberValidators } from './../../shared/validators/phone-number.validators';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { AuthenticationService } from '../../authentication/authentication.service';

@Component({
	selector: 'app-contact-agent',
	templateUrl: './contact-agent.component.html',
	styleUrls: ['./contact-agent.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ContactAgentComponent extends ErrorsDecoratableComponent implements OnInit {

	public contactAgentForm: FormGroup;
	private successMessage: string;

	@Input() agents: any[];
	@Input() propertyId: string;

	constructor(private propertiesService: PropertiesService,
		private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private notificationService: NotificationsService,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);

		this.contactAgentForm = this.formBuilder.group({
			name: ['', [Validators.required]],
			phoneNumber: ['', [Validators.required, PhoneNumberValidators.phoneNumberValidator]],
			email: ['', [Validators.required, Validators.email]],
			message: ['', [Validators.required]],
			agentId: [undefined, [Validators.required]]
		});

		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.isAnonymous) {
					return;
				}
				this.name.setValue(`${userInfo.user.firstName} ${userInfo.user.lastName}`);
				this.phoneNumber.setValue(userInfo.user.phoneNumber);
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

	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async onSubmit() {
		await this.propertiesService.requestInfo(
			this.propertyId,
			this.agentId.value,
			this.name.value,
			this.email.value,
			this.phoneNumber.value,
			this.message.value);

		this.contactAgentForm.reset();
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

}
