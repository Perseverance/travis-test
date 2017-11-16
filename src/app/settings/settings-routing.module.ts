import { MetaGuard } from '@ngx-meta/core';
import { AuthenticatedGuard } from './../authentication/authenticated-guard.service';
import { SettingsComponent } from './settings/settings.component';
import { TokenGuard } from './../authentication/token-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
	{
		path: 'settings',
		component: SettingsComponent,
		canActivate: [TokenGuard, AuthenticatedGuard, MetaGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class SettingsRoutingModule { }
