import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';

import { TransactionToolWorkflowService } from './workflow.service';
import { REVERSE_STEPS, STEPS } from './workflow.model';

@Injectable()
export class WorkflowGuard implements CanActivate {
	constructor(private router: Router, private workflowService: TransactionToolWorkflowService) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

		return this.verifyWorkFlow(route.parent.params.address, route.url[0].path);
	}

	private async verifyWorkFlow(deedId: string, accessedRoute: string): Promise<boolean> {
		const deedStep = await this.workflowService.getDeedStep(deedId);
		const navigatedStep = STEPS[accessedRoute];
		if (navigatedStep > deedStep) {
			this.router.navigate([`/transaction-tool/`, deedId, REVERSE_STEPS[deedStep]]);
			return false;
		}

		return true;
	}
}
