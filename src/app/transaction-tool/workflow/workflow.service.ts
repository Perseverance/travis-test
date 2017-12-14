import {Injectable} from '@angular/core';

import {Step, STEPS} from './workflow.model';
import {
	SmartContractAddress,
	SmartContractConnectionService, Status
} from '../../smart-contract-connection/smart-contract-connection.service';
import {Subscription} from 'rxjs/Subscription';
import {DeedsService} from '../../shared/deeds.service';

@Injectable()
export class TransactionToolWorkflowService {
	public deedAddress;
	private statusToStepMap = {};

	constructor(private smartContractService: SmartContractConnectionService,
				private deedService: DeedsService) {
		this.statusToStepMap[`${Status.reserve}`] = STEPS['invite'];
		this.statusToStepMap[`${Status.partiesInvited}`] = STEPS['invite'];
		this.statusToStepMap[`${Status.partiesAccepted}`] = STEPS['purchase-agreement'];
		this.statusToStepMap[`${Status.purchaseAgreement}`] = STEPS['title-report'];
		this.statusToStepMap[`${Status.titleReport}`] = STEPS['seller-disclosures'];
		this.statusToStepMap[`${Status.sellerDisclosures}`] = STEPS['settlement-statement'];
		this.statusToStepMap[`${Status.settlementStatement}`] = STEPS['closing-documents']; // ToDo: add Affidavit step
		this.statusToStepMap[`${Status.closingDocuments}`] = STEPS['payment'];
		this.statusToStepMap[`${Status.payment}`] = STEPS['payment']; // TODO fix
	}

	public async getDeedStep(deedId: string): Promise<Step> {
		const deed = await this.deedService.getDeedDetails(deedId);
		const step = this.statusToStepMap[`${deed.status}`];
		return step;
	}
}
