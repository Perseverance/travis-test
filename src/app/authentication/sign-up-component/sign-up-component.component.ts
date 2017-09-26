import { SignUpFormValidators } from './sign-up-components.validators';
import { AuthenticationService } from './../authentication.service';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-sign-up-component',
	templateUrl: './sign-up-component.component.html',
	styleUrls: ['./sign-up-component.component.scss']
})
export class SignUpComponentComponent implements OnInit {

	public signupForm: FormGroup;

	constructor(private authService: AuthenticationService, private formBuilder: FormBuilder) { }

	ngOnInit() {
		this.signupForm = this.formBuilder.group({
			email: ['', [Validators.required, Validators.email]],
			passwords: this.formBuilder.group({
				password: ['', [Validators.required, Validators.minLength(8)]],
				repeatPassword: ['', [Validators.required, Validators.minLength(8)]]
			}, { validator: SignUpFormValidators.differentPasswordsValidator }),
			firstName: ['', [Validators.required]],
			lastName: ['', [Validators.required]]
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

	public onSubmit() {
	}

}
