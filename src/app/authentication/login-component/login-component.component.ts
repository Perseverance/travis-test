import { environment } from './../../../environments/environment';
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
export class LoginComponentComponent implements OnInit, OnDestroy {

	public loginForm: FormGroup;
	private queryParamsSubscription: Subscription;
	private redirectToUrl = environment.defaultRedirectRoute;

	constructor(
		private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]],
			rememberMe: [true]
		});

		this.queryParamsSubscription = this.setupQueryParamsWatcher();
	}

	ngOnDestroy() {
		this.queryParamsSubscription.unsubscribe();
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

	public get email() {
		return this.loginForm.get('email');
	}

	public get password() {
		return this.loginForm.get('password');
	}

	public get rememberMe() {
		return this.loginForm.get('rememberMe');
	}

	public async onSubmit() {
		// TODO: Add remember me
		const result = await this.authService.performLogin(this.email.value, this.password.value, this.rememberMe.value);
		this.router.navigate([this.redirectToUrl]);
	}

	public async facebookLogin() {
		const result = await this.authService.performFacebookLogin();
		// TODO make use of the result
		this.router.navigate([this.redirectToUrl]);
	}

	public async linkedInLogin() {
		const result = await this.authService.performLinkedInLogin();
		// TODO make use of the result
		this.router.navigate([this.redirectToUrl]);
	}

}
