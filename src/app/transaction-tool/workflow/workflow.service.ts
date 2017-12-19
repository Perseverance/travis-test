import { Injectable } from '@angular/core';

import { Step, STEPS } from './workflow.model';
import {
	SmartContractAddress,
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
		this.statusToStepMap[`${Status.reserve}`] = STEPS['invite'];
		this.statusToStepMap[`${Status.partiesInvited}`] = STEPS['invite'];
		this.statusToStepMap[`${Status.partiesAccepted}`] = STEPS['invite'];
		this.statusToStepMap[`${Status.reservedOnBlockchain}`] = STEPS['purchase-agreement'];
		this.statusToStepMap[`${Status.purchaseAgreement}`] = STEPS['purchase-agreement'];
		this.statusToStepMap[`${Status.purchaseAgreementBlockchain}`] = STEPS['title-report'];
		this.statusToStepMap[`${Status.titleReport}`] = STEPS['title-report'];
		this.statusToStepMap[`${Status.titleReportBlockchain}`] = STEPS['seller-disclosures'];
		this.statusToStepMap[`${Status.sellerDisclosures}`] = STEPS['seller-disclosures'];
		this.statusToStepMap[`${Status.sellerDisclosuresBlockchain}`] = STEPS['settlement-statement'];
		this.statusToStepMap[`${Status.settlementStatement}`] = STEPS['payment'];
		this.statusToStepMap[`${Status.payment}`] = STEPS['affidavit'];
		this.statusToStepMap[`${Status.affidavit}`] = STEPS['affidavit'];
		this.statusToStepMap[`${Status.affidavitBlockchain}`] = STEPS['closing-documents'];

	}

	public async getDeedStep(deedId: string): Promise<Step> {
		const deed = await this.deedService.getDeedDetails(deedId);
		const step = this.statusToStepMap[`${deed.status}`];
		return step;
	}
}
