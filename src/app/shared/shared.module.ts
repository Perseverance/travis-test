import { SessionStorageService } from './session-storage.service';
import { APIEndpointsService } from './apiendpoints.service';
import { LocalStorageService } from './localStorage.service';
import { RestClientService } from './rest-client.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RedirectableComponent } from './redirectable/redirectable.component';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [],
	providers: [
		RestClientService,
		LocalStorageService,
		SessionStorageService,
		APIEndpointsService
	],
	exports: []
})
export class SharedModule {
}
