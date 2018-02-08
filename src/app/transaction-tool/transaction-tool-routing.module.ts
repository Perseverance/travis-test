import {WalletSetGuard} from './workflow/wallet-set-guard.service';
import {TransferOwnershipComponent} from './transfer-ownership/transfer-ownership.component';
import {ClosingDocumentsComponent} from './closing-documents/closing-documents.component';
import {InviteComponent} from './invite/invite.component';
import {PaymentStepComponent} from './payment-step/payment-step.component';
import {TitleReportComponent} from './title-report/title-report.component';
import {PropertyPreviewComponent} from './property-preview/property-preview.component';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TransactionToolComponent} from './transaction-tool.component';
import {PurchaseAgreementStepComponent} from './purchase-agreement-step/purchase-agreement-step.component';
import {WorkflowGuard} from './workflow/workflow-guard.service';
import {TokenGuard} from '../authentication/token-guard.service';
import {AuthenticatedGuard} from '../authentication/authenticated-guard.service';
import {SettlementStatementComponent} from './settlement-statement/settlement-statement.component';
import {AffidavitStepComponent} from './affidavit-step/affidavit-step.component';
import {DisclosuresStepComponent} from './disclosures-step/disclosures-step.component';
import {CanceledDealComponent} from './canceled-deal/canceled-deal.component';
import {RejectedDealComponent} from './rejected-deal/rejected-deal.component';

const transactionToolSteps: Routes = [
	{
		path: '',
		component: TransactionToolComponent,
		canActivate: [TokenGuard, AuthenticatedGuard, WalletSetGuard],
		children: [
			{
				path: '',
				redirectTo: 'transfer',
				canActivate: [WorkflowGuard]
			},
			{
				path: 'invite',
				component: InviteComponent,
				canActivate: [WorkflowGuard]
			},
			{
				path: 'property-preview',
				component: PropertyPreviewComponent,
				canActivate: [WorkflowGuard]
			},
			{
				path: 'purchase-agreement',
				component: PurchaseAgreementStepComponent,
				canActivate: [WorkflowGuard]
			},
			{
				path: 'title-report',
				component: TitleReportComponent,
				canActivate: [WorkflowGuard]
			},
			{
				path: 'disclosures',
				component: DisclosuresStepComponent,
				canActivate: [WorkflowGuard],
			},
			{
				path: 'settlement-statements',
				component: SettlementStatementComponent,
				canActivate: [WorkflowGuard],
			},
			{
				path: 'affidavit',
				component: AffidavitStepComponent,
				canActivate: [WorkflowGuard],
			},
			{
				path: 'closing-documents',
				component: ClosingDocumentsComponent,
				canActivate: [WorkflowGuard],
			},
			{
				path: 'payment',
				component: PaymentStepComponent,
				canActivate: [WorkflowGuard],
			},
			{
				path: 'transfer',
				component: TransferOwnershipComponent,
				canActivate: [WorkflowGuard],
			},
			{
				path: 'canceled',
				component: CanceledDealComponent,
				canActivate: [WorkflowGuard],
			},
			{
				path: 'rejected',
				component: RejectedDealComponent,
				canActivate: [WorkflowGuard],
			}

		]
	}
];

@NgModule({
	imports: [
		CommonModule,
		RouterModule.forChild(transactionToolSteps)
	],
	declarations: [],
	exports: [
		RouterModule
	]
})
export class TransactionToolRoutingModule {
}
