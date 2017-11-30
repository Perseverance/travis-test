import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionToolComponent} from './transaction-tool.component';
import {TransactionToolRoutingModule} from './transaction-tool-routing.module';
import {PurchaseAgreementStepComponent} from './purchase-agreement-step/purchase-agreement-step.component';
import {FileUploadModule, StepsModule} from 'primeng/primeng';
import {UploadDocumentComponent} from './upload-document/upload-document.component';

@NgModule({
	imports: [
		CommonModule,
		TransactionToolRoutingModule,
		StepsModule,
		FileUploadModule
	],
	declarations: [
		TransactionToolComponent,
		PurchaseAgreementStepComponent,
		UploadDocumentComponent
	],
	exports: [
		TransactionToolRoutingModule
	]
})
export class TransactionToolModule {
}
