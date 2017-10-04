import { environment } from './../environments/environment';
import { PropertiesModule } from './properties/properties.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AuthenticationModule } from './authentication/authentication.module';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AngularGoogleMapsModule } from './angular-google-maps/angular-google-maps.module';
import { CoreModule } from './core/core.module';
import { TranslateStore } from '@ngx-translate/core/src/translate.store';
import { FacebookModule } from 'ngx-facebook';
import { LinkedInSdkModule } from 'angular-linkedin-sdk';

@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		CoreModule,
		AngularGoogleMapsModule,
		AuthenticationModule,
		PropertiesModule,
		AppRoutingModule,
		FacebookModule.forRoot(),
		LinkedInSdkModule
	],
	providers: [
		TranslateStore,
		{ provide: 'apiKey', useValue: environment.linkedInApiKey },
		{ provide: 'authorize', useValue: true }
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
