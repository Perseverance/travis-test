import { PropertyOwnerGuard } from './property-owner.service';
import { MockedFavouriteLocationsService } from './mocked-favourite-locations.service';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgxCarouselModule } from 'ngx-carousel';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { PropertiesService } from './properties.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertiesRoutingModule } from './properties-routing.module';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { ListPropertyComponent } from './list-property/list-property.component';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { FileUploadModule, DropdownModule, CheckboxModule, MultiSelectModule, SliderModule } from 'primeng/primeng';
import { PropertyDescriptionOverviewComponent } from './property-description-overview/property-description-overview.component';
import { MomentModule } from 'angular2-moment';
import { GMapModule } from 'primeng/primeng';
import { ContactAgentComponent } from './contact-agent/contact-agent.component';
import { RatingModule } from 'primeng/primeng';
import { PropertyListingComponent } from './property-listing/property-listing.component';
import { EditListingComponent } from './edit-listing/edit-listing.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		FileUploadModule,
		PropertiesRoutingModule,
		TranslateModule,
		DropdownModule,
		BrowserAnimationsModule,
		CheckboxModule,
		MultiSelectModule,
		NgxCarouselModule,
		SliderModule,
		InlineSVGModule,
		MomentModule,
		GMapModule,
		RatingModule
	],
	declarations: [
		PropertyDetailsComponent,
		ListPropertyComponent,
		PropertyDescriptionOverviewComponent,
		ContactAgentComponent,
		PropertyListingComponent,
		EditListingComponent
	],
	providers: [
		PropertiesService,
		MockedFavouriteLocationsService,
		PropertyOwnerGuard
	]
})
export class PropertiesModule {
}
