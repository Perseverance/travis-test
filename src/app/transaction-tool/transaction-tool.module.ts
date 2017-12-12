import { PropertyItemViewComponent } from './property-preview/property-item-view/property-item-view.component';
import { TextLimitationPipe } from './../shared/pipes/text-limitation.pipe';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TransactionToolComponent } from './transaction-tool.component';
import { TransactionToolRoutingModule } from './transaction-tool-routing.module';
import { PurchaseAgreementStepComponent } from './purchase-agreement-step/purchase-agreement-step.component';
import { FileUploadModule, StepsModule } from 'primeng/primeng';
import { UploadDocumentComponent } from './upload-document/upload-document.component';
import { DocumentPreviewComponent } from './document-preview/document-preview.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { PropertyPreviewComponent } from './property-preview/property-preview.component';
import { SignDocumentComponent } from './sign-document/sign-document.component';
import { SellerDisclosuresStepComponent } from './seller-disclosures-step/seller-disclosures-step.component';
import { SettlementStatementStepComponent } from './settlement-statement-step/settlement-statement-step.component';
import { PaymentStepComponent } from './payment-step/payment-step.component';
import { InlineSVGModule } from 'ng-inline-svg';
import { InviteComponent } from './invite/invite.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		TransactionToolRoutingModule,
		StepsModule,
		FileUploadModule,
		SharedModule,
		InlineSVGModule
	],
	declarations: [
		TransactionToolComponent,
		PurchaseAgreementStepComponent,
		UploadDocumentComponent,
		DocumentPreviewComponent,
		PropertyPreviewComponent,
		SellerDisclosuresStepComponent,
		SignDocumentComponent,
		TextLimitationPipe,
		PropertyItemViewComponent,
		SettlementStatementStepComponent,
		PaymentStepComponent,
		InviteComponent
	],
	exports: [
		TransactionToolRoutingModule
	]
})
export class TransactionToolModule {
}
