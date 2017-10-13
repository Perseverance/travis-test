import {NgModule} from '@angular/core';
import {Routes, RouterModule, PreloadAllModules} from '@angular/router';
import {HomeComponent} from './home/home.component';
import {TokenGuardLazyLoading} from './authentication/token-guard-lazy-loading.service';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		pathMatch: 'full'
	},
	{
		path: 'map',
		loadChildren: './angular-google-maps/angular-google-maps.module#AngularGoogleMapsModule',
		pathMatch: 'full',
		canLoad: [TokenGuardLazyLoading]
	},
	{
		path: '**',
		redirectTo: '',
		pathMatch: 'full'

	}
];

@NgModule({
	imports: [RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})],
	exports: [RouterModule]
})
export class AppRoutingModule {
}
