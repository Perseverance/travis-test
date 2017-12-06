import { SellerDisclosuresStepComponent } from './seller-disclosures-step/seller-disclosures-step.component';
import { InviteEscrowComponent } from './invite-escrow/invite-escrow.component';
import { PropertyPreviewComponent } from './property-preview/property-preview.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { TransactionToolComponent } from './transaction-tool.component';
import { PurchaseAgreementStepComponent } from './purchase-agreement-step/purchase-agreement-step.component';
import { WorkflowGuard } from './workflow/workflow-guard.service';
import { InviteSellerComponent } from './invite-seller/invite-seller.component';
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
				redirectTo: 'seller-disclosures',
				canActivate: [WorkflowGuard]
			},
			{
				path: 'property-preview',
				component: PropertyPreviewComponent,
				canActivate: [WorkflowGuard]
			},
			{
				path: 'invite-seller',
				component: InviteSellerComponent,
				canActivate: [WorkflowGuard]
			},
			{
				path: 'invite-escrow',
				component: InviteEscrowComponent,
				canActivate: [WorkflowGuard]
			},
			{
				path: 'purchase-agreement',
				component: PurchaseAgreementStepComponent,
				canActivate: [WorkflowGuard]
			},
			{
				path: 'seller-disclosures',
				component: SellerDisclosuresStepComponent,
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
