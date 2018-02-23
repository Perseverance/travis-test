import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { FacebookButtonComponent } from './../../authentication/facebook-button/facebook-button.component';
import { NgModule } from '@angular/core';

import { ShareButtonComponent } from './share-button.component';
import { FacebookShareComponent } from './components/index';
import { ChinaShareComponent } from './components/china-share/china-share.component';

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
		FacebookShareComponent,
		ChinaShareComponent
	],
	providers: [],
})
export class ShareButtonModule { }
