import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {FavouriteLocationsComponent} from './favourite-locations/favourite-locations.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgxCarouselModule} from 'ngx-carousel';
import {CustomNumberFormattingPipe} from '../shared/pipes/custom-number-formatting.pipe';

@NgModule({
	declarations: [
		HomeComponent,
		FavouriteLocationsComponent,
		CustomNumberFormattingPipe
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
	exports: [
		CustomNumberFormattingPipe
	]
})
export class HomeModule {
}
