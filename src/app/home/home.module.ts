import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {FavouriteLocationsComponent} from './favourite-locations/favourite-locations.component';
import {BigNumberFormatPipe} from '../shared/pipes/big-number-format.pipe';
import {TranslateModule} from '@ngx-translate/core';
import {NgxCarouselModule} from 'ngx-carousel';

@NgModule({
	declarations: [
		HomeComponent,
		FavouriteLocationsComponent,
		BigNumberFormatPipe
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		ReactiveFormsModule,
		TranslateModule,
		NgxCarouselModule
	],
	providers: [],
	bootstrap: [],
	exports: [BigNumberFormatPipe]
})
export class HomeModule {
}
