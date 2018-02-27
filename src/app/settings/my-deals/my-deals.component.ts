import { MomentService } from './../../shared/moment.service';
import { FlowStatus } from './flow-status.model';
import { DeedsService } from './../../shared/deeds.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SmartContractConnectionService } from '../../smart-contract-connection/smart-contract-connection.service';
import { AuthenticationService, UserData } from '../../authentication/authentication.service';
import { UserRoleEnum } from '../../transaction-tool/enums/user-role.enum';
import { Router } from '@angular/router';
import { TransactionToolWorkflowService } from '../../transaction-tool/workflow/workflow.service';

@Component({
	selector: 'app-my-deals',
	templateUrl: './my-deals.component.html',
	styleUrls: ['./my-deals.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class MyDealsComponent implements OnInit {
	public myDeals: any[];
	private userInfo: any;

	constructor(private smartContractService: SmartContractConnectionService,
	            private authService: AuthenticationService,
	            private deedsService: DeedsService,
	            private router: Router,
	            private workflowService: TransactionToolWorkflowService,
	            private momentService: MomentService) {
		this.authService.subscribeToUserData({
			next: async (userInfo: UserData) => {
				if (userInfo.isAnonymous) {
					return;
				}
				this.userInfo = userInfo.user;
			}
		});
	}

	async ngOnInit() {
		this.myDeals = await this.getMyDeals(this.userInfo.role);
		this.myDeals.forEach((deal) => {
			deal.status = FlowStatus[deal.status];
		});
	}

	private async getMyDeals(userRole: number): Promise<any[]> {
		return await this.deedsService.getMyDeeds();
	}

	public goToTransactionToolWorkflow(data: any) {
		this.router.navigate(['/transaction-tool', data.deedId]);
	}

}
