import { NotificationsService } from './notifications/notifications.service';
import { ErrorsService } from './errors/errors.service';
import { AgmCoreModule } from '@agm/core';
import { environment } from './../../environments/environment';
import { SessionStorageService } from './session-storage.service';
import { APIEndpointsService } from './apiendpoints.service';
import { LocalStorageService } from './localStorage.service';
import { RestClientService } from './rest-client.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocationSearchComponent } from '../location-search/location-search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { TokenGuard } from '../authentication/token-guard.service';

@NgModule({
	imports: [
		CommonModule,
		ReactiveFormsModule,
		AgmCoreModule.forRoot({
			apiKey: environment.googleMaps.apiKey,
			libraries: ['places'],
			language: environment.googleMaps.defaultLanguage
		})
	],
	declarations: [LocationSearchComponent],
	providers: [
		RestClientService,
		LocalStorageService,
		SessionStorageService,
		APIEndpointsService,
		ErrorsService,
		NotificationsService,
		TokenGuard
	],
	exports: [LocationSearchComponent]
})
export class SharedModule {
}
