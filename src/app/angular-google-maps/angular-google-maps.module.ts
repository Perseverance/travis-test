import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {AngularGoogleMapsComponent} from './angular-google-maps.component';
import {CommonModule} from '@angular/common';
import {AngularGoogleMapsRoutingModule} from './angular-google-maps-routing.module';
import {SharedModule} from '../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
	declarations: [
		AngularGoogleMapsComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		AngularGoogleMapsRoutingModule,
		AgmCoreModule,
		TranslateModule
	],
	providers: [],
	bootstrap: []
})
export class AngularGoogleMapsModule {
}
