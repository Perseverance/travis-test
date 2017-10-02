import {APIEndpointsService} from './apiendpoints.service';
import {LocalStorageService} from './localStorage.service';
import {RestClientService} from './rest-client.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

@NgModule({
	imports: [
		CommonModule
	],
	declarations: [],
	providers: [
		RestClientService,
		LocalStorageService,
		APIEndpointsService
	],
	exports: []
})
export class SharedModule {
}
