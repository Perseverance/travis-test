import { UnsubscribeComponent } from './subscriptions/unsubscribe/unsubscribe.component';
import { TokenGuard } from './../../authentication/token-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: 'unsubscribe',
		component: UnsubscribeComponent,
		canActivate: [TokenGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PreferencesRoutingModule { }
