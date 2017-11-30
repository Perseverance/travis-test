import {Component, OnInit} from '@angular/core';
import {Deed, SmartContractConnectionService} from '../../smart-contract-connection/smart-contract-connection.service';
import {AuthenticationService, UserData} from '../../authentication/authentication.service';

export interface Deal {
	deedContractAddress;
	status;
	propertyAddress;
	createdAt;
	lastUpdatedAt;
}

export enum UserRoleEnum {
	Agent = 1,
	Seller = 2,
	Buyer = 3,
	Notary = 4
}

@Component({
	selector: 'app-my-deals',
	templateUrl: './my-deals.component.html',
	styleUrls: ['./my-deals.component.scss']
})
export class MyDealsComponent implements OnInit {
	public myDeals: Deal[];

	constructor(private smartContractService: SmartContractConnectionService,
				private authService: AuthenticationService) {
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

}
