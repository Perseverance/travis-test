import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AgmCoreModule } from '@agm/core';
import { AngularGoogleMapsComponent } from './angular-google-maps.component';
import { CommonModule } from '@angular/common';
import { AngularGoogleMapsRoutingModule } from './angular-google-maps-routing.module';
import { TranslateModule } from '@ngx-translate/core';
import { CoreModule } from '../core/core.module';
import { SharedModule } from '../shared/shared.module';

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
		CoreModule
	],
	providers: [],
	bootstrap: []
})
export class AngularGoogleMapsModule {
}
