import {PropertyConversionService} from './property-conversion.service';
import {MomentService} from './moment.service';
import {BigNumberFormatPipe} from './pipes/big-number-format.pipe';
import {GoogleMapsMarkersService} from './google-maps-markers.service';
import {AgencyService} from './agency.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocationSearchComponent} from '../location-search/location-search.component';
import {ReactiveFormsModule} from '@angular/forms';
import {NewPropertyComponentComponent} from './new-property-component/new-property-component.component';
import {PopertyTypeLocalizeKeyPipe} from './pipes/poperty-type-localize-key.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {ThousandSeparatorPipe} from './pipes/thousand-separator.pipe';
import {CurrencySymbolPipe} from './pipes/currency-symbol.pipe';
import {PropertySizeUnitOfMeasurePipe} from './pipes/property-size-unit-of-measure.pipe';
import {ImageEnvironmentPrefixPipe} from './pipes/image-environment-prefix.pipe';
import {EllipsisPipe} from './ellipsis.pipe';
import {ImageSizePipe} from './pipes/image-size.pipe';
import {Image404Directive} from './image404.directive';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		TranslateModule
	],
	declarations: [
		LocationSearchComponent,
		NewPropertyComponentComponent,
		PopertyTypeLocalizeKeyPipe,
		ThousandSeparatorPipe,
		CurrencySymbolPipe,
		BigNumberFormatPipe,
		PropertySizeUnitOfMeasurePipe,
		ImageEnvironmentPrefixPipe,
		EllipsisPipe,
		ImageSizePipe,
		Image404Directive
	],
	exports: [
		LocationSearchComponent,
		NewPropertyComponentComponent,
		PopertyTypeLocalizeKeyPipe,
		ThousandSeparatorPipe,
		CurrencySymbolPipe,
		BigNumberFormatPipe,
		PropertySizeUnitOfMeasurePipe,
		ImageEnvironmentPrefixPipe,
		EllipsisPipe,
		ImageSizePipe
	],
	providers: [
		AgencyService,
		GoogleMapsMarkersService,
		MomentService,
		PropertyConversionService
	]
})
export class SharedModule {
}
