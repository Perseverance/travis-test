import {TermsComponent} from './core/terms/terms.component';
import {AboutUsComponent} from './core/about/about.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {MetaGuard} from '@ngx-meta/core';

const routes: Routes = [
	{
		path: '',
		canActivate: [MetaGuard],
		component: HomeComponent,
		pathMatch: 'full'
	},
	{
		path: 'terms',
		canActivate: [MetaGuard],
		component: TermsComponent,
		pathMatch: 'full'
	},
	{
		path: 'map',
		loadChildren: './google-map/google-map.module#GoogleMapModule'
	},
	{
		path: 'settings',
		loadChildren: './settings/settings.module#SettingsModule'
	},
	{
		path: 'transaction-tool/:address',
		loadChildren: './transaction-tool/transaction-tool.module#TransactionToolModule'
	},
	{
		path: 'about',
		canActivate: [MetaGuard],
		component: AboutUsComponent,
		pathMatch: 'full'
	},
	{
		path: 'Users/RequestInvite',
		canActivate: [MetaGuard],
		redirectTo: 'signup',
		pathMatch: 'full'
	},
	{
		path: 'packer',
		canActivate: [MetaGuard],
		redirectTo: 'property/packer',
		pathMatch: 'full'
	},
	{
		path: 'packer-house',
		canActivate: [MetaGuard],
		redirectTo: 'property/packer-house',
		pathMatch: 'full'
	},
	{
		path: '**',
		canActivate: [MetaGuard],
		redirectTo: '',
		pathMatch: 'full'

	}
];

@NgModule({
	imports: [
		RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
	],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
