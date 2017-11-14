import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {HomeComponent} from './home.component';
import {SharedModule} from '../shared/shared.module';
import {FavouriteLocationsComponent} from './favourite-locations/favourite-locations.component';
import {TranslateModule} from '@ngx-translate/core';
import {NgxCarouselModule} from 'ngx-carousel';
import {TestimonialsComponent} from './testimonials/testimonials.component';
import {NewPropertiesComponent} from './new-properties/new-properties.component';
import {DropdownModule} from 'primeng/primeng';
import {ProposalIosComponent} from './proposal-ios/proposal-ios.component';
import {HowPropyWorksComponent} from './how-propy-works/how-propy-works.component';
import {SafeURLPipe} from '../shared/pipes/safe-url.pipe';
import {InlineSVGModule} from 'ng-inline-svg';
import { NewsletterComponent } from './newsletter/newsletter.component';

@NgModule({
	declarations: [
		HomeComponent,
		FavouriteLocationsComponent,
		TestimonialsComponent,
		NewPropertiesComponent,
		ProposalIosComponent,
		HowPropyWorksComponent,
		SafeURLPipe,
		NewsletterComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		ReactiveFormsModule,
		TranslateModule,
		NgxCarouselModule,
		DropdownModule,
		InlineSVGModule
	],
	providers: [],
	bootstrap: [],
	exports: []
})
export class HomeModule {
}
