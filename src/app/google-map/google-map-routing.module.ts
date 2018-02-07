import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {GoogleMapComponent} from './google-map.component';
import {MetaGuard} from '@ngx-meta/core';

const googleMapsRoutes: Routes = [
		{
			path: '',
			component: GoogleMapComponent,
			canActivate: [MetaGuard]
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
