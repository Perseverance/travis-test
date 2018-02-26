import { PropertiesService } from './../../properties/properties.service';
import { MomentService } from './../../shared/moment.service';
import { TransactionToolWorkflowService } from './../../transaction-tool/workflow/workflow.service';
import { Router } from '@angular/router';
import { DeedsService } from './../../shared/deeds.service';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { SmartContractConnectionService } from './../../smart-contract-connection/smart-contract-connection.service';

import { Component, OnInit } from '@angular/core';
import { LoadPropertyService } from '../../transaction-tool/load-property.service';

@Component({
	selector: 'app-accept-reject-properties',
	templateUrl: './accept-reject-properties.component.html',
	styleUrls: ['./accept-reject-properties.component.scss']
})
export class AcceptRejectPropertiesComponent implements OnInit {
	public myPendingProperties: any[];

	constructor(private smartContractService: SmartContractConnectionService,
		private authService: AuthenticationService,
		private deedsService: DeedsService,
		private propertyService: PropertiesService,
		private router: Router,
		private workflowService: TransactionToolWorkflowService,
		private momentService: MomentService) {
		this.authService.subscribeToUserData({
			next: async (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
				this.myPendingProperties = await this.getMyPendingProperties();


			}
		});
	}

	ngOnInit() {
	}

	private async getMyPendingProperties(): Promise<any[]> {
		return await this.propertyService.getPendingProperties();
	}

	public goToTransactionToolWorkflow(data: any) {
		this.router.navigate(['/property', data.deedId]);
	}
}