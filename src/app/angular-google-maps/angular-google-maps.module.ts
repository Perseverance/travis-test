import {NgModule} from '@angular/core';
import {environment} from './../../environments/environment';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {AngularGoogleMapsComponent} from './angular-google-maps.component';
import {CommonModule} from '@angular/common';
import {AngularGoogleMapsRoutingModule} from './angular-google-maps-routing.module';
import {TranslateModule} from '@ngx-translate/core';
import {CoreModule} from '../core/core.module';

@NgModule({
	declarations: [
		AngularGoogleMapsComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		AngularGoogleMapsRoutingModule,
		AgmCoreModule.forRoot({
			apiKey: environment.googleMapsApiKey,
			libraries: ['places']
		}),
		CoreModule
	],
	providers: [],
	bootstrap: []
})
export class AngularGoogleMapsModule {
}
