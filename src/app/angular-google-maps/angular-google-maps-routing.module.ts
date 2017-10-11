import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AngularGoogleMapsComponent} from './angular-google-maps.component';
import {TokenGuard} from '../authentication/token-guard.service';

const googleMapsRoutes: Routes = [
		{path: 'map', component: AngularGoogleMapsComponent, canActivate: [TokenGuard]}
	]
;

@NgModule({
	imports: [
		RouterModule.forChild(googleMapsRoutes)
	],
	exports: [RouterModule]
})
export class AngularGoogleMapsRoutingModule {
}
