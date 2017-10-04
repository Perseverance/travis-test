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
export class SignUpComponentComponent implements OnInit, OnDestroy {

	public signupForm: FormGroup;
	private queryParamsSubscription: Subscription;
	private redirectToUrl = '';

	constructor(
		private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private router: Router,
		private route: ActivatedRoute) {
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
			lastName: ['', [Validators.required]]
		});
	}

	ngOnInit() {
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

	public async onSubmit() {
		const result = await this.authService.performSignUp(this.email.value, this.password.value, this.firstName.value, this.lastName.value);
		this.router.navigate([this.redirectToUrl]);
	}

}
