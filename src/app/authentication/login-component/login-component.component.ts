import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/operator/filter';

@Component({
	selector: 'app-login-component',
	templateUrl: './login-component.component.html',
	styleUrls: ['./login-component.component.scss']
})
export class LoginComponentComponent implements OnInit, OnDestroy {

	public loginForm: FormGroup;
	private queryParamsSubscription: Subscription;
	private redirectToUrl = '';

	constructor(
		private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.loginForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', [Validators.required]]
		});

		this.queryParamsSubscription = this.setupQueryParamsWatcher();
	}

	ngOnDestroy() {
		this.queryParamsSubscription.unsubscribe();
	}

	private setupQueryParamsWatcher() {
		return this.route.queryParams
			.subscribe(params => {
				this.redirectToUrl = params.redirect;
			});
	}

	public get email() {
		return this.loginForm.get('email');
	}

	public get password() {
		return this.loginForm.get('password');
	}

	public async onSubmit() {
		// TODO: Add remember me
		const result = await this.authService.performLogin(this.email.value, this.password.value);
		console.log(this.redirectToUrl);
		this.router.navigate([this.redirectToUrl]);
	}

	public async facebookLogin() {
		const result = await this.authService.performFacebookLogin();
		console.log(result);
	}

}
