import { Injectable } from '@angular/core';

import { Step, STEPS } from './workflow.model';
import {
	Deed, SmartContractAddress,
	SmartContractConnectionService, Status
} from '../../smart-contract-connection/smart-contract-connection.service';
import { Subscription } from 'rxjs/Subscription';
import { DeedsService } from '../../shared/deeds.service';

@Injectable()
export class TransactionToolWorkflowService {
	public deedAddress;
	private statusToStepMap = {};

	constructor(private smartContractService: SmartContractConnectionService,
		private deedService: DeedsService) {
		this.statusToStepMap[`${Status.reserve}`] = STEPS['invite-seller'];
		this.statusToStepMap[`${Status.sellerInvited}`] = STEPS['accept-seller'];
		this.statusToStepMap[`${Status.sellerAccepted}`] = STEPS['invite-escrow'];
		this.statusToStepMap[`${Status.escrowInvited}`] = STEPS['accept-escrow'];
		this.statusToStepMap[`${Status.escrowAccepted}`] = STEPS['purchase-agreement'];
		this.statusToStepMap[`${Status.purchaseAgreement}`] = STEPS['settlement-statement'];
		this.statusToStepMap[`${Status.settlementStatement}`] = STEPS['seller-disclosures'];
		this.statusToStepMap[`${Status.sellerDisclosures}`] = STEPS['closing-documents'];
		this.statusToStepMap[`${Status.closingDocuments}`] = STEPS['payment'];
		this.statusToStepMap[`${Status.payment}`] = STEPS['payment']; // TODO fix
	}

	public async getDeedStep(deedId: string): Promise<Step> {
		const deed = await this.deedService.getDeedDetails(deedId);
		const step = this.statusToStepMap[`${deed.status}`];
		return step;
	}
}
