import { PropertiesService } from './properties.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertiesRoutingModule } from './properties-routing.module';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { ListPropertyComponent } from './list-property/list-property.component';

@NgModule({
	imports: [
		CommonModule,
		PropertiesRoutingModule
	],
	declarations: [PropertyDetailsComponent, ListPropertyComponent],
	providers: [
		PropertiesService
	]
})
export class PropertiesModule { }
