import { ErrorsService } from './errors/errors.service';
import { SessionStorageService } from './session-storage.service';
import { APIEndpointsService } from './apiendpoints.service';
import { LocalStorageService } from './localStorage.service';
import { RestClientService } from './rest-client.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PropertySearchComponent } from '../property-search/property-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenGuard } from '../authentication/token-guard.service';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule
	],
	declarations: [PropertySearchComponent],
	providers: [
		RestClientService,
		LocalStorageService,
		SessionStorageService,
		APIEndpointsService,
		ErrorsService,
		TokenGuard
	],
	exports: [PropertySearchComponent]
})
export class SharedModule {
}
