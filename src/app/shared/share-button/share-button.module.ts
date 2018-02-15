import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FacebookButtonComponent } from './../../authentication/facebook-button/facebook-button.component';
import { NgModule } from '@angular/core';

import { ShareButtonComponent } from './share-button.component';
import { FacebookShareComponent } from './components/index';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	exports: [
		ShareButtonComponent,
		FacebookShareComponent
	],
	declarations: [
		ShareButtonComponent,
		FacebookShareComponent
	],
	providers: [],
})
export class ShareButtonModule { }
