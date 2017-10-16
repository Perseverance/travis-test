import { AgencyService } from './agency.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationSearchComponent } from '../location-search/location-search.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule
	],
	declarations: [LocationSearchComponent],
	exports: [LocationSearchComponent],
	providers: [
		AgencyService
	]
})
export class SharedModule {
}
