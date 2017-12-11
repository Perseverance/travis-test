import {Component, OnInit} from '@angular/core';
import {Deed, SmartContractConnectionService} from '../../smart-contract-connection/smart-contract-connection.service';
import {AuthenticationService, UserData} from '../../authentication/authentication.service';
import {UserRoleEnum} from '../../transaction-tool/enums/user-role.enum';
import {Router} from '@angular/router';
import {TransactionToolWorkflowService} from '../../transaction-tool/workflow/workflow.service';

@Component({
	selector: 'app-my-deals',
	templateUrl: './my-deals.component.html',
	styleUrls: ['./my-deals.component.scss']
})
export class MyDealsComponent implements OnInit {
	public myDeals: Deed[];

	constructor(private smartContractService: SmartContractConnectionService,
				private authService: AuthenticationService,
				private router: Router,
				private workflowService: TransactionToolWorkflowService) {
		this.authService.subscribeToUserData({
			next: async (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
				this.myDeals = await this.getMyDeals(userInfo.user.role);
			}
		});
	}

	ngOnInit() {
	}

	private async getMyDeals(userRole: number): Promise<Deed[]> {
		switch (userRole) {
			case UserRoleEnum.Buyer: {
				return await this.smartContractService.getBuyerDeeds();
			}
			case UserRoleEnum.Seller: {
				return await this.smartContractService.getSellerDeeds();
			}
			case UserRoleEnum.Agent: {
				return await this.smartContractService.getAgentDeeds();
			}
			case UserRoleEnum.Escrow: {
				return await this.smartContractService.getEscrowDeeds();
			}
			default: {
				throw new Error('Invalid user role');
			}
		}
	}

	public goToTransactionToolWorkflow(data: any) {
		this.router.navigate(['/transaction-tool', data.deedContractAddress]);
	}

}
