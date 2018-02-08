import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GoogleMapComponent} from './google-map.component';
import {MetaGuard} from '@ngx-meta/core';
import {TokenGuard} from '../authentication/token-guard.service';

const googleMapsRoutes: Routes = [
		{
			path: '',
			component: GoogleMapComponent,
			canActivate: [TokenGuard, MetaGuard]
		}
	]
;

@NgModule({
	imports: [
		RouterModule.forChild(googleMapsRoutes)
	],
	exports: [RouterModule]
})
export class GoogleMapsRoutingModule {
}
