import { TokenGuard } from './authentication/token-guard.service';
import { TermsComponent } from './core/terms/terms.component';
import { AboutUsComponent } from './core/about/about.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { TokenGuardLazyLoading } from './authentication/token-guard-lazy-loading.service';
import { GoogleMapComponent } from './google-map/google-map.component';

const routes: Routes = [
	{
		path: '',
		component: HomeComponent,
		pathMatch: 'full'
	},
	{
		path: 'terms',
		component: TermsComponent,
		pathMatch: 'full'
	},
	{
		path: 'old-map',
		loadChildren: './angular-google-maps/angular-google-maps.module#AngularGoogleMapsModule',
		pathMatch: 'full',
		canLoad: [TokenGuardLazyLoading]
	},
	{
		path: 'map',
		component: GoogleMapComponent,
		pathMatch: 'full',
		canActivate: [TokenGuard]
	},
	{
		path: 'about',
		component: AboutUsComponent,
		pathMatch: 'full'
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
