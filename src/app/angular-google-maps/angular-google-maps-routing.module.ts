import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {AngularGoogleMapsComponent} from './angular-google-maps.component';

const googleMapsRoutes: Routes = [
    {path: '', component: AngularGoogleMapsComponent}
  ]
;

@NgModule({
  imports: [
    RouterModule.forChild(googleMapsRoutes)
  ],
  exports: [RouterModule]
})
export class AngularGoogleMapsRoutingModule {
}
