import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {GoogleMapComponent} from './google-map.component';
import {GMapModule, OverlayPanelModule, SliderModule} from 'primeng/primeng';
import {SelectButtonModule} from 'primeng/primeng';
import {PropertiesListComponent} from './properties-list/properties-list.component';

@NgModule({
	declarations: [
		GoogleMapComponent,
		PropertiesListComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		TranslateModule,
		GMapModule,
		SelectButtonModule,
		OverlayPanelModule,
		SliderModule
	],
	providers: [],
	bootstrap: []
})
export class GoogleMapModule {
}
