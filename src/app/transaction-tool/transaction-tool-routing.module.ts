import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {TransactionToolComponent} from './transaction-tool.component';
import {PurchaseAgreementStepComponent} from './purchase-agreement-step/purchase-agreement-step.component';

const transactionToolSteps: Routes = [
	{
		path: 'transaction-tool',
		component: TransactionToolComponent,
		children: [
			{
				path: 'purchase-agreement',
				component: PurchaseAgreementStepComponent
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
