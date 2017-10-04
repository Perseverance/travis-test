import {NgModule} from '@angular/core';
import {environment} from './../../environments/environment';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {CommonModule} from '@angular/common';
import {CoreModule} from '../core/core.module';
import {HomeComponent} from './home.component';
import {HomeRoutingModule} from './home-routing.module';
import {SharedModule} from '../shared/shared.module';

@NgModule({
	declarations: [
		HomeComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		ReactiveFormsModule,
		HomeRoutingModule,
		AgmCoreModule.forRoot({
			apiKey: environment.googleMapsApiKey,
			libraries: ['places']
		}),
		CoreModule
	],
	providers: [],
	bootstrap: []
})
export class HomeModule {
}
