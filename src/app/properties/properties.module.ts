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
import { FileUploadModule, DropdownModule } from 'primeng/primeng';

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
		BrowserAnimationsModule
	],
	declarations: [PropertyDetailsComponent, ListPropertyComponent],
	providers: [
		PropertiesService
	]
})
export class PropertiesModule {
}
