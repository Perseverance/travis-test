import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {AuthenticationModule} from './authentication/authentication.module';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AngularGoogleMapsModule} from './angular-google-maps/angular-google-maps.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AngularGoogleMapsModule,
    AuthenticationModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
