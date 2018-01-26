import { WebpackTranslateLoader } from './../../webpack-translate-loader';
import { TextLimitationPipe } from './../shared/pipes/text-limitation.pipe';
import { AuthenticatedGuard } from './../authentication/authenticated-guard.service';
import { ReferralComponent } from './../referral/referral.component';
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
import { TranslateStore } from '@ngx-translate/core/src/translate.store';
import { environment } from '../../environments/environment';
import { TermsComponent } from './terms/terms.component';
import { AboutUsComponent } from './about/about.component';
import { BigNumberFormatPipe } from '../shared/pipes/big-number-format.pipe';
import { CurrencySymbolPipe } from '../shared/pipes/currency-symbol.pipe';
import { ImageEnvironmentPrefixPipe } from '../shared/pipes/image-environment-prefix.pipe';
import { ImageSizePipe } from '../shared/pipes/image-size.pipe';
import { PropertySizeUnitOfMeasurePipe } from '../shared/pipes/property-size-unit-of-measure.pipe';
import { ThousandSeparatorPipe } from '../shared/pipes/thousand-separator.pipe';
import { BrowserDetectionService } from '../shared/browser-detection.service';
import { LanguageLabelPipe } from '../shared/pipes/language-label.pipe';
import { ConfirmationService } from 'primeng/primeng';
import { ProWalletService } from '../pro-wallet/pro-wallet.service';
import { AvatarModule } from 'ngx-avatar';
import { ProWalletTranslationsService } from '../pro-wallet/translations/pro-wallet-translations.service';
import { PusherService } from '../shared/pusher.service';
import { NotificationsComponent } from './header/notifications/notifications.component';
import { SmartContractConnectionService } from '../smart-contract-connection/smart-contract-connection.service';
import { TransactionToolModule } from '../transaction-tool/transaction-tool.module';
import { TransactionToolWorkflowService } from '../transaction-tool/workflow/workflow.service';
import { TransactionToolDocumentService } from '../transaction-tool/transaction-tool-document.service';
import { WorkflowGuard } from '../transaction-tool/workflow/workflow-guard.service';
import { HelloSignService } from '../shared/hello-sign.service';
import { LoadPropertyService } from '../transaction-tool/load-property.service';
import { NotificationGrowlComponent } from '../notification-growl/notification-growl.component';
import { GrowlModule } from 'primeng/components/growl/growl';
import { WalletSetGuard } from '../transaction-tool/workflow/wallet-set-guard.service';
import { VerificationService } from '../verification/verification.service';
import { MessageService } from 'primeng/components/common/messageservice';
import { NotAuthenticatedGuard } from '../authentication/not-authenticated-guard.service';
import { CryptoWidgetComponent } from './crypto-widget/crypto-widget.component';
import { CurrencyDataService } from './crypto-widget/currency-data.service';

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
				useClass: WebpackTranslateLoader
			}

		}),
		SharedModule,
		AvatarModule,
		TransactionToolModule,
		GrowlModule
	],
	declarations: [
		HeaderComponent,
		NotificationMessageComponent,
		FooterComponent,
		TermsComponent,
		AboutUsComponent,
		ReferralComponent,
		LanguageLabelPipe,
		NotificationsComponent,
		NotificationGrowlComponent
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
		NotAuthenticatedGuard,
		TranslateStore,
		{ provide: 'apiKey', useValue: environment.linkedInApiKey },
		{ provide: 'authorize', useValue: true },
		BigNumberFormatPipe,
		CurrencySymbolPipe,
		ImageEnvironmentPrefixPipe,
		ImageSizePipe,
		TextLimitationPipe,
		PropertySizeUnitOfMeasurePipe,
		ThousandSeparatorPipe,
		BrowserDetectionService,
		ConfirmationService,
		ProWalletService,
		ProWalletTranslationsService,
		PusherService,
		SmartContractConnectionService,
		TransactionToolWorkflowService,
		TransactionToolDocumentService,
		WorkflowGuard,
		WalletSetGuard,
		HelloSignService,
		LoadPropertyService,
		VerificationService,
		MessageService
	],
	exports: [
		TranslateModule,
		HeaderComponent,
		FooterComponent,
		NotificationMessageComponent,
		TermsComponent,
		AboutUsComponent,
		NotificationsComponent,
		TransactionToolModule,
		NotificationGrowlComponent
	]
})
export class CoreModule {
}
