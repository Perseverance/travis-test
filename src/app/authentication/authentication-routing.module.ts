import { MetaGuard } from '@ngx-meta/core';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { LoginComponentComponent } from './login-component/login-component.component';
import { SignUpComponentComponent } from './sign-up-component/sign-up-component.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TokenGuard } from './token-guard.service';
import { NotAuthenticatedGuard } from './not-authenticated-guard.service';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponentComponent,
		canActivate: [TokenGuard, NotAuthenticatedGuard, MetaGuard]
	},
	{
		path: 'signup',
		component: SignUpComponentComponent,
		canActivate: [TokenGuard, NotAuthenticatedGuard, MetaGuard]
	},
	{
		path: 'forgot',
		component: ForgotPasswordComponent,
		canActivate: [TokenGuard, NotAuthenticatedGuard, MetaGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthenticationRoutingModule {
}
