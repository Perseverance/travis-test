import {DeedsService} from './deeds.service';
import {GoogleAnalyticsEventsService} from './google-analytics.service';
import {PropertyConversionService} from './property-conversion.service';
import {MomentService} from './moment.service';
import {BigNumberFormatPipe} from './pipes/big-number-format.pipe';
import {GoogleMapsMarkersService} from './google-maps-markers.service';
import {AgencyService} from './agency.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LocationSearchComponent} from '../location-search/location-search.component';
import {ReactiveFormsModule} from '@angular/forms';
import {PopertyTypeLocalizeKeyPipe} from './pipes/poperty-type-localize-key.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {ThousandSeparatorPipe} from './pipes/thousand-separator.pipe';
import {CurrencySymbolPipe} from './pipes/currency-symbol.pipe';
import {PropertySizeUnitOfMeasurePipe} from './pipes/property-size-unit-of-measure.pipe';
import {ImageEnvironmentPrefixPipe} from './pipes/image-environment-prefix.pipe';
import {EllipsisPipe} from './ellipsis.pipe';
import {ImageSizePipe} from './pipes/image-size.pipe';
import {Image404Directive} from './image404.directive';
import {PropertyPreviewComponent} from './property-preview/property-preview.component';
import {HelloSignComponent} from '../hello-sign/hello-sign.component';
import {SafeResourceURLPipe} from './pipes/safe-resource-url.pipe';
import {SafeUrlPipe} from './pipes/safe-url.pipe';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		TranslateModule
	],
	declarations: [
		LocationSearchComponent,
		PropertyPreviewComponent,
		PopertyTypeLocalizeKeyPipe,
		ThousandSeparatorPipe,
		CurrencySymbolPipe,
		BigNumberFormatPipe,
		PropertySizeUnitOfMeasurePipe,
		ImageEnvironmentPrefixPipe,
		EllipsisPipe,
		ImageSizePipe,
		Image404Directive,
		HelloSignComponent,
		SafeResourceURLPipe,
		SafeUrlPipe
	],
	exports: [
		LocationSearchComponent,
		PropertyPreviewComponent,
		PopertyTypeLocalizeKeyPipe,
		ThousandSeparatorPipe,
		CurrencySymbolPipe,
		BigNumberFormatPipe,
		PropertySizeUnitOfMeasurePipe,
		ImageEnvironmentPrefixPipe,
		EllipsisPipe,
		ImageSizePipe,
		HelloSignComponent,
		SafeResourceURLPipe,
		SafeUrlPipe
	],
	providers: [
		AgencyService,
		GoogleMapsMarkersService,
		MomentService,
		DeedsService,
		PropertyConversionService,
		GoogleAnalyticsEventsService
	]
})
export class SharedModule {
}
