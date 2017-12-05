import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TransactionToolComponent} from './transaction-tool.component';
import {TransactionToolRoutingModule} from './transaction-tool-routing.module';
import {PurchaseAgreementStepComponent} from './purchase-agreement-step/purchase-agreement-step.component';
import {FileUploadModule, StepsModule} from 'primeng/primeng';
import {UploadDocumentComponent} from './upload-document/upload-document.component';
import {DocumentPreviewComponent} from './document-preview/document-preview.component';
import {FormsModule} from '@angular/forms';
import {SharedModule} from '../shared/shared.module';
import { InviteSellerComponent } from './invite-seller/invite-seller.component';
import { InviteEscrowComponent } from './invite-escrow/invite-escrow.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		TransactionToolRoutingModule,
		StepsModule,
		FileUploadModule,
		SharedModule
	],
	declarations: [
		TransactionToolComponent,
		PurchaseAgreementStepComponent,
		UploadDocumentComponent,
		DocumentPreviewComponent,
		InviteSellerComponent,
		InviteEscrowComponent
	],
	exports: [
		TransactionToolRoutingModule
	]
})
export class TransactionToolModule {
}
