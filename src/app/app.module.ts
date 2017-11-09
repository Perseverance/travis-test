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
		PropertiesModule,
		SettingsModule,
		GoogleMapModule,
		AppRoutingModule,
		FacebookModule.forRoot(),
		LinkedInSdkModule,
		InlineSVGModule.forRoot({ baseUrl: '' })

	],
	bootstrap: [AppComponent]
})
export class AppModule {
}
