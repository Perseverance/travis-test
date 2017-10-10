import { PropertiesService } from './properties.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PropertiesRoutingModule } from './properties-routing.module';
import { PropertyDetailsComponent } from './property-details/property-details.component';

@NgModule({
	imports: [
		CommonModule,
		PropertiesRoutingModule
	],
	declarations: [PropertyDetailsComponent],
	providers: [
		PropertiesService
	]
})
export class PropertiesModule { }
