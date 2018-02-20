import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { environment } from './../../../environments/environment';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { DefaultAsyncAPIErrorHandling } from './../../shared/errors/errors.decorators';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';


@Component({
	selector: 'app-login-component',
	templateUrl: './login-component.component.html',
	styleUrls: ['./login-component.component.scss']
})
export class LoginComponentComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	public loginForm: FormGroup;
	public verifyForm: FormGroup;
	private queryParamsSubscription: Subscription;
	public showVerificationDialog = false;

	private redirectToUrl = environment.defaultRedirectRoute;


	constructor(private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);

		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]],
			rememberMe: [true]
		});
		this.verifyForm = this.formBuilder.group({
			verifyEmail: ['', [Validators.required, Validators.email]]
		});
	}

	ngOnInit() {
		this.queryParamsSubscription = this.setupQueryParamsWatcher();
	}

	ngOnDestroy() {
		this.queryParamsSubscription.unsubscribe();
	}

	private setupQueryParamsWatcher(): Subscription {
		return this.route.queryParams
			.subscribe(params => {
				// Check if there are no params passed in
				// OR if redirect points to forgotten pass page
				if (!params.redirect || params.redirect === '/forgot') {
					return;
				}
				this.redirectToUrl = params.redirect;
			});
	}

	public get email() {
		return this.loginForm.get('email');
	}

	public get verifyEmail() {
		return this.verifyForm.get('verifyEmail');
	}

	public get password() {
		return this.loginForm.get('password');
	}

	public get rememberMe() {
		return this.loginForm.get('rememberMe');
	}

	@DefaultAsyncAPIErrorHandling('common.label.authentication-error')
	public async onSubmit() {
		const result = await this.authService.performLogin(this.email.value, this.password.value, this.rememberMe.value);
		this.router.navigate([this.redirectToUrl]);
	}

	@DefaultAsyncAPIErrorHandling('common.label.authentication-error')
	public async facebookLogin() {
		const result = await this.authService.performFacebookLogin();
		if (!result.isEmailVerified) {
			this.openVerifyEmailPopup();
			return;
		}

		this.router.navigate([this.redirectToUrl]);
	}

	private openVerifyEmailPopup() {
		this.showVerificationDialog = true;
	}

	@DefaultAsyncAPIErrorHandling('common.label.authentication-error')
	public async sendVerificationEmailAddress() {
		const result = await this.authService.updateVerificationEmail(this.verifyEmail.value);
		this.router.navigate([this.redirectToUrl]);
	}

}
