import {Injectable} from '@angular/core';

import {STEPS} from './workflow.model';
import {Deed} from '../../smart-contract-connection/smart-contract-connection.service';

@Injectable()
export class TransactionToolWorkflowService {
	public deal: Deed;
	private workflow = [
		{step: STEPS.inviteSeller, valid: false},
		{step: STEPS.inviteEscrow, valid: false},
		{step: STEPS.purchaseAgreement, valid: false}
	];

	// validateStep(step: string) {
	// 	// If the state is found, set the valid field to true 
	// 	var found = false;
	// 	for (var i = 0; i < this.workflow.length && !found; i++) {
	// 		if (this.workflow[i].step === step) {
	// 			found = this.workflow[i].valid = true;
	// 		}
	// 	}
	// }

	public set dealDetails(deal: Deed) {
		this.deal = deal;
		console.log(this.deal);
	}

	public get dealDetails(): Deed {
		return this.deal;
	}

	resetSteps() {
		// Reset all the steps in the Workflow to be invalid
		this.workflow.forEach(element => {
			element.valid = false;
		});
	}

	getFirstInvalidStep(step: string): string {
		// If all the previous steps are validated, return blank
		// Otherwise, return the first invalid step
		let found = false;
		let valid = true;
		let redirectToStep = '';
		for (let i = 0; i < this.workflow.length && !found && valid; i++) {
			const item = this.workflow[i];
			if (item.step === step) {
				found = true;
				redirectToStep = '';
			} else {
				valid = item.valid;
				redirectToStep = item.step
			}
		}
		return redirectToStep;
	}
}
