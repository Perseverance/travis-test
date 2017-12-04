import {Injectable} from '@angular/core';

import {Step, STEPS} from './workflow.model';
import {
	Deed, SmartContractAddress,
	SmartContractConnectionService, Status
} from '../../smart-contract-connection/smart-contract-connection.service';
import {Subscription} from 'rxjs/Subscription';

@Injectable()
export class TransactionToolWorkflowService {
	public deedAddress;
	private statusToStepMap = {};

	constructor(private smartContractService: SmartContractConnectionService) {
		this.statusToStepMap[`${Status.reserve}`] = STEPS['invite-seller'];
		this.statusToStepMap[`${Status.sellerInvited}`] = STEPS['invite-escrow'];
		this.statusToStepMap[`${Status.agentInvited}`] = STEPS['purchase-agreement'];
	}

	public async getDeedStep(deedAddress: SmartContractAddress): Promise<Step> {
		const deed = await this.smartContractService.getDeedDetails(this.deedAddress);
		const step = this.statusToStepMap[`${deed.status}`];
		return step;
	}
}
