import { InviteComponent } from './invite/invite.component';
import { PaymentStepComponent } from './payment-step/payment-step.component';
import { SettlementStatementStepComponent } from './settlement-statement-step/settlement-statement-step.component';
import { SellerDisclosuresStepComponent } from './seller-disclosures-step/seller-disclosures-step.component';
import { PropertyPreviewComponent } from './property-preview/property-preview.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TransactionToolComponent } from './transaction-tool.component';
import { PurchaseAgreementStepComponent } from './purchase-agreement-step/purchase-agreement-step.component';
import { WorkflowGuard } from './workflow/workflow-guard.service';
import { TokenGuard } from '../authentication/token-guard.service';
import { AuthenticatedGuard } from '../authentication/authenticated-guard.service';

const transactionToolSteps: Routes = [
	{
		path: 'transaction-tool/:address',
		component: TransactionToolComponent,
		canActivate: [TokenGuard, AuthenticatedGuard],
		children: [
			{
				path: '',
				pathMatch: 'full',
				redirectTo: 'payment',
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
				path: 'settlement-statement',
				component: SettlementStatementStepComponent,
				canActivate: [WorkflowGuard]
			},
			{
				path: 'seller-disclosures',
				component: SellerDisclosuresStepComponent,
				canActivate: [WorkflowGuard],
			},
			{
				path: 'closing-documents',
				component: SellerDisclosuresStepComponent,
				canActivate: [WorkflowGuard],
			},
			{
				path: 'payment',
				component: PaymentStepComponent,
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
