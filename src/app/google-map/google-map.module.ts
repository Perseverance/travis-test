import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { GoogleMapComponent } from './google-map.component';
import {
	GMapModule,
	ProgressSpinnerModule,
	OverlayPanelModule,
	SelectButtonModule,
	SliderModule,
	DropdownModule


} from 'primeng/primeng';
import { PropertiesListComponent } from './properties-list/properties-list.component';
import { PriceFilterComponent } from './properties-list/price-filter/price-filter.component';
import { AreaFilterComponent } from './properties-list/area-filter/area-filter.component';
import { BedFilterComponent } from './properties-list/bed-filter/bed-filter.component';
import { MapEventsService } from './map-events.service';

@NgModule({
	declarations: [
		GoogleMapComponent,
		PropertiesListComponent,
		PriceFilterComponent,
		AreaFilterComponent,
		BedFilterComponent
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
		SliderModule,
		ProgressSpinnerModule,
		DropdownModule

	],
	providers: [
		MapEventsService
	],
	bootstrap: []
})
export class GoogleMapModule {
}
