import {LoginComponentComponent} from './login-component/login-component.component';
import {SignUpComponentComponent} from './sign-up-component/sign-up-component.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TokenGuard} from './token-guard.service';

const routes: Routes = [
	{
		path: 'login',
		component: LoginComponentComponent,
		canActivate: [TokenGuard]
	},
	{
		path: 'signup',
		component: SignUpComponentComponent,
		canActivate: [TokenGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class AuthenticationRoutingModule {
}
