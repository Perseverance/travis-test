import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {FavouriteLocationsComponent} from './favourite-locations/favourite-locations.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgxCarouselModule} from 'ngx-carousel';
import {ThousandSeparatorPipe} from '../shared/pipes/thousand-separator.pipe';
import {CurrencySymbolPipe} from '../shared/pipes/currency-symbol.pipe';
import {TestimonialsComponent} from './testimonials/testimonials.component';
import {NewPropertiesComponent} from './new-properties/new-properties.component';
import {DropdownModule} from 'primeng/primeng';
import {PopertyTypeLocalizeKeyPipe} from '../shared/pipes/poperty-type-localize-key.pipe';
import {PropertySizeUnitOfMeasurePipe} from '../shared/pipes/property-size-unit-of-measure.pipe';

@NgModule({
	declarations: [
		HomeComponent,
		FavouriteLocationsComponent,
		ThousandSeparatorPipe,
		CurrencySymbolPipe,
		PopertyTypeLocalizeKeyPipe,
		PropertySizeUnitOfMeasurePipe,
		TestimonialsComponent,
		NewPropertiesComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		ReactiveFormsModule,
		TranslateModule,
		NgxCarouselModule,
		DropdownModule
	],
	providers: [],
	bootstrap: [],
	exports: [
		ThousandSeparatorPipe,
		CurrencySymbolPipe,
		PopertyTypeLocalizeKeyPipe,
		PropertySizeUnitOfMeasurePipe
	]
})
export class HomeModule {
}
