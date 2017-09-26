import {NgModule} from '@angular/core';

import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {AgmCoreModule} from '@agm/core';
import {AngularGoogleMapsComponent} from './angular-google-maps.component';
import {CommonModule} from '@angular/common';

@NgModule({
  declarations: [
    AngularGoogleMapsComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBo_Hj_8WUUY1YhUcRugWwFLNymZtMm9dc', // ToDo: Vladdy's API Key, have to replace with Propy's one
      libraries: ['places']
    })
  ],
  providers: [],
  bootstrap: []
})
export class AngularGoogleMapsModule {
}
