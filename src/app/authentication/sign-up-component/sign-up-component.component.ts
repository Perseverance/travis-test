import { Agency } from './../../models/agency.model';
import { AgencySuggestionsService } from './../agency-suggestions.service';
import { ErrorsService } from './../../shared/errors/errors.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { DefaultAsyncAPIErrorHandling } from './../../shared/errors/errors.decorators';
import { environment } from './../../../environments/environment';
import { APIEndpointsService } from './../../shared/apiendpoints.service';
import { SignUpFormValidators } from './sign-up-components.validators';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-sign-up-component',
	templateUrl: './sign-up-component.component.html',
	styleUrls: ['./sign-up-component.component.scss']
})
export class SignUpComponentComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	private AGENCY_SUGGESTIONS_MIN_LEN = 3;
	private AGENCY_SUGGESTIONS_WAIT_MS = 200;
	private AGENCY_MAX_SUGGESTIONS = 5;

	public signupForm: FormGroup;
	private queryParamsSubscription: Subscription;

	private agencyInputSubscription: Subscription;
	private _agentLocation: string = null;

	private _agencySuggestions: Agency[];

	private redirectToUrl = environment.defaultRedirectRoute;

	constructor(
		private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		private agencySuggestionsService: AgencySuggestionsService,
		errorsService: ErrorsService,
		translateService: TranslateService) {

		super(errorsService, translateService);
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
			iAmAnAgent: [false],
			agentFields: this.formBuilder.group({
				phoneNumber: ['', [Validators.required, SignUpFormValidators.phoneNumberValidator]],
				expertise: ['', [Validators.required]],
				agency: ['', [Validators.required]],
				agencyPassword: ['', [Validators.required]]
			}),
			rememberMe: [true]
		});
	}

	ngOnInit() {
		this.queryParamsSubscription = this.setupQueryParamsWatcher();
		this.agencyInputSubscription = this.setupAgencyInputWatcher();
	}

	ngOnDestroy() {
		this.queryParamsSubscription.unsubscribe();
		this.agencyInputSubscription.unsubscribe();
	}

	private setupQueryParamsWatcher() {
		return this.route.queryParams
			.subscribe(params => {
				if (!params.redirect) {
					return;
				}
				this.redirectToUrl = params.redirect;
			});
	}

	private setupAgencyInputWatcher() {
		return this.agency.valueChanges
			.debounceTime(this.AGENCY_SUGGESTIONS_WAIT_MS)
			.subscribe(agencyPart => {
				if (agencyPart.length < this.AGENCY_SUGGESTIONS_MIN_LEN) {
					return;
				}
				this.getAgencySuggestions(agencyPart);
			});
	}

	private async getAgencySuggestions(userInput: string) {
		this._agencySuggestions = await this.agencySuggestionsService.getAgencySuggestions(userInput);
	}

	public get agencySuggestions(): Agency[] {
		if (!this._agencySuggestions) {
			return this._agencySuggestions;
		}
		if (this._agencySuggestions.length < 2) {
			return [];
		}
		return this._agencySuggestions.filter((element: Agency, index: number) => {
			return index < this.AGENCY_MAX_SUGGESTIONS;
		});
	}

	public trackByAgency(index: number, agency: Agency): string {
		return agency.id;
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
		return this.agentFields.get('phoneNumber');
	}

	public get expertise() {
		return this.agentFields.get('expertise');
	}

	public get agency() {
		return this.agentFields.get('agency');
	}

	public get agencyId() {
		if (!this._agencySuggestions) {
			return null;
		}
		for (const agencySuggestion of this._agencySuggestions) {
			if (agencySuggestion.name === this.agency.value) {
				return agencySuggestion.id;
			}
		}
		return null;
	}

	public get agencyPassword() {
		return this.agentFields.get('agencyPassword');
	}

	public get rememberMe() {
		return this.signupForm.get('rememberMe');
	}

	public get agentLocation(): string {
		if (this._agentLocation === '') {
			return null;
		}
		return this._agentLocation;
	}

	public onLocationFound(latitude: number, longitude: number, locationAddress: string) {
		this._agentLocation = locationAddress;
	}

	@DefaultAsyncAPIErrorHandling('common.label.authentication-error')
	public async onSubmit() {
		const result = await this.authService
			.performSignUp(
			this.email.value,
			this.password.value,
			this.firstName.value,
			this.lastName.value,
			this.rememberMe.value
			);
		if (this.iAmAnAgent.value) {
			const agentResult = await this.authService.performAgentSignup({
				firstName: this.firstName.value,
				lastName: this.lastName.value,
				email: this.email.value,
				agencyId: this.agencyId,
				agencyName: this.agency.value,
				locations: [this._agentLocation],
				info: this.expertise.value,
				phoneNumber: this.phoneNumber.value
			});
		}
		this.router.navigate([this.redirectToUrl]);
	}

	@DefaultAsyncAPIErrorHandling('common.label.authentication-error')
	public async facebookLogin() {
		const result = await this.authService.performFacebookLogin();
		this.router.navigate([this.redirectToUrl]);
	}

	@DefaultAsyncAPIErrorHandling('common.label.authentication-error')
	public async linkedInLogin() {
		const result = await this.authService.performLinkedInLogin();
		this.router.navigate([this.redirectToUrl]);
	}

}
