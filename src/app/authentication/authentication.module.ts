import { SharedModule } from './../shared/shared.module';
import { AuthenticationService } from './authentication.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AuthenticationRoutingModule } from './authentication-routing.module';
import { LoginComponentComponent } from './login-component/login-component.component';
import { SignUpComponentComponent } from './sign-up-component/sign-up-component.component';

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    AuthenticationRoutingModule
  ],
  declarations: [
    LoginComponentComponent,
    SignUpComponentComponent
  ],
  providers: [
    AuthenticationService
  ]
})
export class AuthenticationModule { }
