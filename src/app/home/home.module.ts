import { CryptoWidgetComponent } from './../core/crypto-widget/crypto-widget.component';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HomeComponent } from './home.component';
import { SharedModule } from '../shared/shared.module';
import { FavouriteLocationsComponent } from './favourite-locations/favourite-locations.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxCarouselModule } from 'ngx-carousel';
import { TestimonialsComponent } from './testimonials/testimonials.component';
import { NewPropertiesComponent } from './new-properties/new-properties.component';
import { DropdownModule, ProgressSpinnerModule } from 'primeng/primeng';
import { ProposalIosComponent } from './proposal-ios/proposal-ios.component';
import { HowPropyWorksComponent } from './how-propy-works/how-propy-works.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { NewsletterComponent } from './newsletter/newsletter.component';
import { FeaturedPropertiesComponent } from './featured-properties/featured-properties.component';
import { CurrencyDataService } from '../core/crypto-widget/currency-data.service';
import { CryptoWidgetMobileComponent } from '../core/crypto-widget-mobile/crypto-widget-mobile.component';

@NgModule({
	declarations: [
		HomeComponent,
		FavouriteLocationsComponent,
		TestimonialsComponent,
		NewPropertiesComponent,
		ProposalIosComponent,
		HowPropyWorksComponent,
		NewsletterComponent,
		FeaturedPropertiesComponent,
		CryptoWidgetComponent,
		NewsletterComponent,
		FeaturedPropertiesComponent,
		CryptoWidgetMobileComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		SharedModule,
		ReactiveFormsModule,
		TranslateModule,
		NgxCarouselModule,
		DropdownModule,
		InlineSVGModule,
		ProgressSpinnerModule
	],
	providers: [CurrencyDataService],
	bootstrap: [],
	exports: [CryptoWidgetComponent, CryptoWidgetMobileComponent]
})
export class HomeModule {
}
