import {AuthenticatedGuard} from './../authentication/authenticated-guard.service';
import {ReferralComponent} from './../referral/referral.component';
import {NotificationMessageComponent} from './notification-message/notification-message.component';
import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HeaderComponent} from './header/header.component';
import {SharedModule} from '../shared/shared.module';
import {FooterComponent} from './footer/footer.component';
import {RestClientService} from '../shared/rest-client.service';
import {LocalStorageService} from '../shared/localStorage.service';
import {SessionStorageService} from '../shared/session-storage.service';
import {APIEndpointsService} from '../shared/apiendpoints.service';
import {ErrorsService} from '../shared/errors/errors.service';
import {NotificationsService} from '../shared/notifications/notifications.service';
import {TokenGuard} from '../authentication/token-guard.service';
import {TranslateStore} from '@ngx-translate/core/src/translate.store';
import {environment} from '../../environments/environment';
import {TermsComponent} from './terms/terms.component';
import {AboutUsComponent} from './about/about.component';
import {BigNumberFormatPipe} from '../shared/pipes/big-number-format.pipe';
import {CurrencySymbolPipe} from '../shared/pipes/currency-symbol.pipe';
import {ImageEnvironmentPrefixPipe} from '../shared/pipes/image-environment-prefix.pipe';
import {ImageSizePipe} from '../shared/pipes/image-size.pipe';
import {PropertySizeUnitOfMeasurePipe} from '../shared/pipes/property-size-unit-of-measure.pipe';
import {ThousandSeparatorPipe} from '../shared/pipes/thousand-separator.pipe';
import {BrowserDetectionService} from '../shared/browser-detection.service';
import {LanguageLabelPipe} from '../shared/pipes/language-label.pipe';
import {ConfirmationService} from 'primeng/primeng';
import {ProWalletService} from '../pro-wallet/pro-wallet.service';

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
		TermsComponent,
		AboutUsComponent,
		ReferralComponent,
		LanguageLabelPipe
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
		AuthenticatedGuard,
		TranslateStore,
		{provide: 'apiKey', useValue: environment.linkedInApiKey},
		{provide: 'authorize', useValue: true},
		BigNumberFormatPipe,
		CurrencySymbolPipe,
		ImageEnvironmentPrefixPipe,
		ImageSizePipe,
		PropertySizeUnitOfMeasurePipe,
		ThousandSeparatorPipe,
		BrowserDetectionService,
		ConfirmationService,
		ProWalletService
	],
	exports: [
		TranslateModule,
		HeaderComponent,
		FooterComponent,
		NotificationMessageComponent,
		TermsComponent,
		AboutUsComponent
	]
})
export class CoreModule {
}
