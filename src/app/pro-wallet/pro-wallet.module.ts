import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProWalletComponent} from './pro-wallet.component';
import {TranslateModule} from '@ngx-translate/core';
import {ClipboardModule} from 'ngx-clipboard/dist';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		ClipboardModule
	],
	declarations: [ProWalletComponent],
	exports: [ProWalletComponent]
})
export class ProWalletModule {
}
