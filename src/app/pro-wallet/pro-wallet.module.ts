import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProWalletComponent } from './pro-wallet.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
	imports: [
		CommonModule,
		TranslateModule,
		FormsModule,
		ReactiveFormsModule,
	],
	declarations: [ProWalletComponent],
	exports: [ProWalletComponent]
})
export class ProWalletModule {
}
