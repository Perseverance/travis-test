import {RouterModule} from '@angular/router';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {TranslateHttpLoader} from '@ngx-translate/http-loader';
import {HeaderComponent} from './header/header.component';
import {SharedModule} from '../shared/shared.module';
import {ErrorMessageComponent} from './error-message/error-message.component';
import {FooterComponent} from './footer/footer.component';

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
		ErrorMessageComponent,
		FooterComponent
	],
	providers: [
		HttpClient
	],
	exports: [
		TranslateModule,
		HeaderComponent,
		FooterComponent,
		ErrorMessageComponent
	]
})
export class CoreModule {
}
