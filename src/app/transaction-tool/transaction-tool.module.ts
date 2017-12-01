import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionToolComponent} from './transaction-tool.component';
import {TransactionToolRoutingModule} from './transaction-tool-routing.module';
import {PurchaseAgreementStepComponent} from './purchase-agreement-step/purchase-agreement-step.component';
import {FileUploadModule, StepsModule} from 'primeng/primeng';
import {UploadDocumentComponent} from './upload-document/upload-document.component';
import {DocumentPreviewComponent} from './document-preview/document-preview.component';
import {FormsModule} from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TransactionToolRoutingModule,
		StepsModule,
		FileUploadModule
	],
	declarations: [
		TransactionToolComponent,
		PurchaseAgreementStepComponent,
		UploadDocumentComponent,
		DocumentPreviewComponent
	],
	exports: [
		TransactionToolRoutingModule
	]
})
export class TransactionToolModule {
}
