import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {TranslateModule} from '@ngx-translate/core';
import {GoogleMapComponent} from './google-map.component';
import {GMapModule} from 'primeng/primeng';

@NgModule({
	declarations: [
		GoogleMapComponent
	],
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SharedModule,
		TranslateModule,
		GMapModule
	],
	providers: [],
	bootstrap: []
})
export class GoogleMapModule {
}
