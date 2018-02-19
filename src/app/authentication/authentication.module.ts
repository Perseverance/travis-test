import { TranslateModule } from '@ngx-translate/core';
import { AgencySuggestionsService } from './agency-suggestions.service';
import { SharedModule } from './../shared/shared.module';
import { AuthenticationService } from './authentication.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Ng2CompleterModule } from 'ng2-completer';
import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponentComponent } from './login-component/login-component.component';
import { SignUpComponentComponent } from './sign-up-component/sign-up-component.component';
import { LinkedinButtonComponent } from './linkedin-button/linkedin-button.component';
import { FacebookButtonComponent } from './facebook-button/facebook-button.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { InternationalPhoneModule } from 'ng4-intl-phone/src/lib';
import { PasswordStrengthBarModule } from 'ng2-password-strength-bar';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		AuthenticationRoutingModule,
		Ng2CompleterModule,
		TranslateModule,
		InlineSVGModule,
		InternationalPhoneModule,
		PasswordStrengthBarModule
	],
	declarations: [
		LoginComponentComponent,
		SignUpComponentComponent,
		LinkedinButtonComponent,
		FacebookButtonComponent,
		ForgotPasswordComponent
	],
	providers: [
		AuthenticationService,
		AgencySuggestionsService
	]
})
export class AuthenticationModule {
}
