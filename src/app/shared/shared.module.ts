import {SessionStorageService} from './session-storage.service';
import {APIEndpointsService} from './apiendpoints.service';
import {LocalStorageService} from './localStorage.service';
import {RestClientService} from './rest-client.service';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RedirectableComponent} from './redirectable/redirectable.component';
import {GoogleSearchComponent} from '../google-search/google-search.component';
import {ReactiveFormsModule} from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule
	],
	declarations: [GoogleSearchComponent],
	providers: [
		RestClientService,
		LocalStorageService,
		SessionStorageService,
		APIEndpointsService
	],
	exports: [GoogleSearchComponent]
})
export class SharedModule {
}
