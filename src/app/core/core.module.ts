import { NotificationMessageComponent } from './notification-message/notification-message.component';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HeaderComponent } from './header/header.component';
import { SharedModule } from '../shared/shared.module';
import { FooterComponent } from './footer/footer.component';
import { RestClientService } from '../shared/rest-client.service';
import { LocalStorageService } from '../shared/localStorage.service';
import { SessionStorageService } from '../shared/session-storage.service';
import { APIEndpointsService } from '../shared/apiendpoints.service';
import { ErrorsService } from '../shared/errors/errors.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { TokenGuard } from '../authentication/token-guard.service';
import { TokenGuardLazyLoading } from '../authentication/token-guard-lazy-loading.service';
import { TranslateStore } from '@ngx-translate/core/src/translate.store';
import { environment } from '../../environments/environment';
import { TermsComponent } from './terms/terms.component';

// AoT requires an exported function for factories
export function HttpLoaderFactory(http: HttpClient) {
	return new TranslateHttpLoader(http);
}

@NgModule({
	imports: [
		CommonModule,
		HttpClientModule,
		RouterModule,
		TranslateModule.forChild({
			loader: {
				provide: TranslateLoader,
				useFactory: HttpLoaderFactory,
				deps: [HttpClient]
			}
		}),
		SharedModule
	],
	declarations: [
		HeaderComponent,
		NotificationMessageComponent,
		FooterComponent,
		TermsComponent
	],
	providers: [
		HttpClient,
		RestClientService,
		LocalStorageService,
		SessionStorageService,
		APIEndpointsService,
		ErrorsService,
		NotificationsService,
		TokenGuard,
		TokenGuardLazyLoading,
		TranslateStore,
		{ provide: 'apiKey', useValue: environment.linkedInApiKey },
		{ provide: 'authorize', useValue: true }
	],
	exports: [
		TranslateModule,
		HeaderComponent,
		FooterComponent,
		NotificationMessageComponent,
		TermsComponent
	]
})
export class CoreModule {
}
