import {Component, OnInit} from '@angular/core';
import {Deed, SmartContractConnectionService} from '../../smart-contract-connection/smart-contract-connection.service';
import {AuthenticationService, UserData} from '../../authentication/authentication.service';
import {UserRoleEnum} from '../../transaction-tool/enums/user-role.enum';
import {Router} from '@angular/router';
import {TransactionToolWorkflowService} from '../../transaction-tool/workflow/workflow.service';

export interface Deal {
	deedContractAddress;
	status;
	propertyAddress;
	createdAt;
	lastUpdatedAt;
}

@Component({
	selector: 'app-my-deals',
	templateUrl: './my-deals.component.html',
	styleUrls: ['./my-deals.component.scss']
})
export class MyDealsComponent implements OnInit {
	public myDeals: Deal[];

	constructor(private smartContractService: SmartContractConnectionService,
				private authService: AuthenticationService,
				private router: Router,
				private workflowService: TransactionToolWorkflowService) {
		this.authService.subscribeToUserData({
			next: async (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
				await this.getMyDeals(userInfo.user.role);
			}
		});
	}

	ngOnInit() {
	}

	private async getMyDeals(id: number) {
		switch (id) {
			case UserRoleEnum.Buyer: {
				this.myDeals = await this.smartContractService.getBuyerDeeds();
				break;
			}
			case UserRoleEnum.Seller: {
				this.myDeals = await this.smartContractService.getSellerDeeds();
				break;
			}
			case UserRoleEnum.Agent: {
				this.myDeals = await this.smartContractService.getAgentDeeds();
				break;
			}
			default: {
				throw new Error('Invalid user role');
			}
		}
	}

	public goToTransactionToolWorkflow(data: any) {
		this.router.navigate(['/transaction-tool']);
		this.workflowService.dealDetails = data;
	}

}
