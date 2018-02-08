import { NotificationsService } from './../../shared/notifications/notifications.service';
import { GoogleAnalyticsEventsService } from './../../shared/google-analytics.service';
import { AgencyService } from './../../shared/agency.service';
import { CompleterService, RemoteData, CompleterItem } from 'ng2-completer';
import { AgencySuggestionsService } from './../agency-suggestions.service';
import { ErrorsService } from './../../shared/errors/errors.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { DefaultAsyncAPIErrorHandling } from './../../shared/errors/errors.decorators';
import { environment } from './../../../environments/environment';
import { SignUpFormValidators } from './sign-up-components.validators';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { IntPhonePrefixComponent } from 'ng4-intl-phone/src/lib';

@Component({
	selector: 'app-sign-up-component',
	templateUrl: './sign-up-component.component.html',
	styleUrls: ['./sign-up-component.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SignUpComponentComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	private AGENCY_SUGGESTIONS_MIN_LEN = 3;
	private AGENCY_SUGGESTIONS_WAIT_MS = 200;
	private AGENCY_MAX_SUGGESTIONS = 5;

	public signupForm: FormGroup;
	private paramsSubscriptions = new Array<Subscription>();

	public agencyId: string = null;

	public agentLocations: string[] = new Array<string>();
	private redirectToUrl = environment.defaultRedirectRoute;
	private referralId: string;
	private emailSentSuccess: string;
	public defaultPhoneCountryCode: string;
	public phoneMinLength = 4;
	public phoneMaxLengthWithPlusSign = 21;

	@ViewChild(IntPhonePrefixComponent) childPhoneComponent: IntPhonePrefixComponent;

	protected agencyAutoCompleteDataService: RemoteData;

	constructor(private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private agencySuggestionsService: AgencySuggestionsService,
		private completerService: CompleterService,
		private agencyService: AgencyService,
		private notificationsService: NotificationsService,
		errorsService: ErrorsService,
		translateService: TranslateService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {

		super(errorsService, translateService);

		this.defaultPhoneCountryCode = 'us';
		this.agencyAutoCompleteDataService = completerService.remote('', 'name', 'name');
		this.agencyAutoCompleteDataService.urlFormater((term: string) => {
			return `${this.agencySuggestionsService.agenciesSearchURL}${term}`;
		});
		this.agencyAutoCompleteDataService.dataField('data');
		this.translateService.stream(['verification.activation-email-sent']).subscribe(translations => {
			this.emailSentSuccess = translations['verification.activation-email-sent'];
		});

		this.signupForm = this.formBuilder.group({
			email: ['',
				[Validators.required, Validators.email],
				[SignUpFormValidators.emailTakenValidator(this.authService.restClient, this.authService.apiEndpoints)]
			],
			passwords: this.formBuilder.group({
				password: ['', [Validators.required, SignUpFormValidators.passwordSymbolsValidator]],
				repeatPassword: ['', [Validators.required, SignUpFormValidators.passwordSymbolsValidator]]
			}, { validator: SignUpFormValidators.differentPasswordsValidator }),
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]],
			phoneNumber: ['', Validators.compose([
				Validators.minLength(this.phoneMinLength),
				Validators.maxLength(this.phoneMaxLengthWithPlusSign)])
			],
			iAmAnAgent: [false],
			agentFields: this.formBuilder.group({
				expertise: ['', [Validators.required]],
				agency: ['', [Validators.required]],
				agencyPassword: ['']
			}),
			rememberMe: [true]
		});
	}

	ngOnInit() {
		const self = this;
		this.paramsSubscriptions.push(this.setupParamsWatcher());
		this.paramsSubscriptions.push(this.setupQueryParamsWatcher());
	}

	ngOnDestroy() {
		for (const subscription of this.paramsSubscriptions) {
			subscription.unsubscribe();
		}
	}

	private setupQueryParamsWatcher() {
		return this.route.queryParams
			.subscribe(params => {
				if (params.redirect) {
					this.redirectToUrl = params.redirect;
				}
				if (params.referrerId) {
					this.referralId = params.referrerId;
				}

			});
	}

	private setupParamsWatcher() {
		return this.route.params
			.subscribe(params => {
				if (params.redirect) {
					this.redirectToUrl = params.redirect;
				}
				if (params.referral) {
					this.referralId = params.referral;
				}

			});
	}

	public get email() {
		return this.signupForm.get('email');
	}

	public get passwords() {
		return this.signupForm.get('passwords');
	}

	public get password() {
		return this.passwords.get('password');
	}

	public get repeatPassword() {
		return this.passwords.get('repeatPassword');
	}

	public get firstName() {
		return this.signupForm.get('firstName');
	}

	public get lastName() {
		return this.signupForm.get('lastName');
	}

	public get iAmAnAgent() {
		return this.signupForm.get('iAmAnAgent');
	}

	public get agentFields() {
		return this.signupForm.get('agentFields');
	}

	public get phoneNumber() {
		return this.signupForm.get('phoneNumber');
	}

	public get expertise() {
		return this.agentFields.get('expertise');
	}

	public get agency() {
		return this.agentFields.get('agency');
	}

	public get agencyPassword() {
		return this.agentFields.get('agencyPassword');
	}

	public get rememberMe() {
		return this.signupForm.get('rememberMe');
	}

	public onLocationFound(latitude: number, longitude: number, locationAddress: string) {
		this.addAgentLocation(locationAddress);
	}

	public addAgentLocation(locationAddress: string) {
		this.agentLocations.push(locationAddress);
	}

	public removeAgentLocationAtIndex(index: number) {
		this.agentLocations.splice(index, 1);
	}

	public onAgencySelected(selected: CompleterItem) {
		if (selected == null) {
			return;
		}
		this.agencyId = selected.originalObject.id;
	}

	@DefaultAsyncAPIErrorHandling('common.label.authentication-error')
	public async registerUser() {
		this.googleAnalyticsEventsService.emitEvent('page-sign-up', 'sign-up');
		let phoneNumber;
		if (this.phoneNumber.value) {
			phoneNumber = `+${this.childPhoneComponent.selectedCountry.dialCode}${this.phoneNumber.value}`;
		} else {
			phoneNumber = '';
		}
		this.phoneNumber.setValidators(Validators.compose([
			Validators.minLength(this.phoneMinLength),
			Validators.maxLength(this.phoneMaxLengthWithPlusSign)]));
		const result = await this.authService
			.performSignUp(
			this.email.value,
			this.password.value,
			this.firstName.value.trim(),
			this.lastName.value.trim(),
			phoneNumber,
			this.rememberMe.value
			);
		if (this.iAmAnAgent.value) {
			if (this.agencyId == null) {
				if (this.agency.value.length === 0) {
					return;
				}
				this.agencyId = await this.createAgency(this.agency.value);
			}
			const agentResult = await this.authService.performAgentSignup({
				firstName: this.firstName.value,
				lastName: this.lastName.value,
				email: this.email.value,
				agencyId: this.agencyId,
				agencyName: this.agency.value,
				locations: this.agentLocations,
				info: this.expertise.value
			});
		}
		this.notificationsService.pushSuccess({
			title: this.emailSentSuccess,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
		this.router.navigate([this.redirectToUrl]);
		if (result && this.referralId) {
			const email = this.email.value;
			this.referralPost(email, this.referralId);
		}
	}

	private async createAgency(agencyName: string): Promise<string> {
		return await this.agencyService.createAgency(agencyName);
	}

	@DefaultAsyncAPIErrorHandling('common.label.authentication-error')
	public async facebookLogin() {
		const result = await this.authService.performFacebookLogin();
		if (result && this.referralId) {
			const email = this.authService.user.email;
			this.referralPost(email, this.referralId);
		}
		this.router.navigate([this.redirectToUrl]);
	}

	@DefaultAsyncAPIErrorHandling('common.label.authentication-error')
	public async linkedInLogin() {
		const result = await this.authService.performLinkedInLogin();
		if (result && this.referralId) {
			const email = this.authService.user.email;
			this.referralPost(email, this.referralId);
		}
		this.router.navigate([this.redirectToUrl]);
	}

	private async referralPost(email: string, referralId: string): Promise<any> {
		const result = await this.authService.assignRefferer(email, referralId);
	}

	public updateControlAsTouched() {
		this.phoneNumber.markAsTouched();
	}

	public activatePhoneDropDown() {
		this.childPhoneComponent.showDropDown();
	}

	public handlePhoneInputChanged() {
		if (this.childPhoneComponent && this.childPhoneComponent.selectedCountry) {
			this.phoneNumber.setValidators(Validators.compose([
				Validators.minLength(this.phoneMinLength),
				Validators.maxLength(this.phoneMaxLengthWithPlusSign - (this.childPhoneComponent.selectedCountry.dialCode.length + 1))]));
		}
	}
}
