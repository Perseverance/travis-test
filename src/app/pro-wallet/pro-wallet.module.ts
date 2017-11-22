import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ProWalletComponent} from './pro-wallet.component';
import {TranslateModule} from '@ngx-translate/core';
import {ClipboardModule} from 'ngx-clipboard/dist';
import {TransactionStatusLocalizeKeyPipe} from './translations/transaction-status-localize-key.pipe';
import {TransactionRewardLocalizeKeyPipe} from './translations/transaction-reward-localize-key.pipe';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		ClipboardModule
	],
	declarations: [
		ProWalletComponent,
		TransactionStatusLocalizeKeyPipe,
		TransactionRewardLocalizeKeyPipe
	],
	exports: [ProWalletComponent]
})
export class ProWalletModule {
}
