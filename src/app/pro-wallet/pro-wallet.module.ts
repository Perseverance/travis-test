import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProWalletComponent} from './pro-wallet.component';
import {TranslateModule} from '@ngx-translate/core';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule
	],
	declarations: [ProWalletComponent],
	exports: [ProWalletComponent]
})
export class ProWalletModule {
}
