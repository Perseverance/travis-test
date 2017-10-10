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

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		AuthenticationRoutingModule,
		Ng2CompleterModule,
		TranslateModule
	],
	declarations: [
		LoginComponentComponent,
		SignUpComponentComponent,
		LinkedinButtonComponent,
		FacebookButtonComponent
	],
	providers: [
		AuthenticationService,
		AgencySuggestionsService
	]
})
export class AuthenticationModule { }
