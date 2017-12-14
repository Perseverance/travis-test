import { Web3Module } from './web3/web3.module';
import { MetaModule } from '@ngx-meta/core';
import { SettingsModule } from './settings/settings.module';
import { PropertiesModule } from './properties/properties.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthenticationModule } from './authentication/authentication.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CoreModule } from './core/core.module';
import { FacebookModule } from 'ngx-facebook';
import { HomeModule } from './home/home.module';
import { LinkedInSdkModule } from 'angular-linkedin-sdk';
import { GoogleMapModule } from './google-map/google-map.module';
import { InlineSVGModule } from 'ng-inline-svg';
import { PageTitlePositioning, MetaLoader, MetaStaticLoader } from '@ngx-meta/core';
import { IntercomModule, INTERCOM_DIRECTIVES } from 'ng2-intercom';
import { PurchaseModule } from './purchase/purchase.module';
import { TransactionToolComponent } from './transaction-tool/transaction-tool.component';

export function metaFactory(): MetaLoader {
	return new MetaStaticLoader({
		pageTitlePositioning: PageTitlePositioning.AppendPageTitle,
		pageTitleSeparator: ' - ',
		applicationName: 'Propy',
		defaults: {
			title: 'Propy - Buy or sell investment properties',
			description:
				`Propy is a global real estate store, allowing buyers, sellers,
				 and all other parties to come together through blockchain smart contracts`,
			author: 'https://www.propy.com/',
			'og:image': 'http://storagepropy.blob.core.windows.net/images/system/propy-social.jpg',
			'og:url': 'https://www.propy.com/',
			'og:type': 'website',
			'og:locale': 'en',
			'og:locale:alternate': 'ru,ar,zh'
		}
	});
}

@NgModule({
	declarations: [
		AppComponent,
		...INTERCOM_DIRECTIVES
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		CoreModule,
		HomeModule,
		AuthenticationModule,
		PropertiesModule,
		SettingsModule,
		PurchaseModule,
		GoogleMapModule,
		Web3Module,
		AppRoutingModule,
		FacebookModule.forRoot(),
		LinkedInSdkModule,
		InlineSVGModule.forRoot({ baseUrl: '' }),
		MetaModule.forRoot({
			provide: MetaLoader,
			useFactory: (metaFactory)
		}),
		IntercomModule,

	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
