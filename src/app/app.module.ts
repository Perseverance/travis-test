import { environment } from './../environments/environment';
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
import { AgmCoreModule } from '@agm/core';


@NgModule({
	declarations: [
		AppComponent
	],
	imports: [
		BrowserModule,
		FormsModule,
		ReactiveFormsModule,
		CoreModule,
		HomeModule,
		AuthenticationModule,
		AgmCoreModule.forRoot({
			apiKey: environment.googleMaps.apiKey,
			libraries: ['places'],
			language: environment.googleMaps.defaultLanguage
		}),
		PropertiesModule,
		AppRoutingModule,
		FacebookModule.forRoot(),
		LinkedInSdkModule
	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
