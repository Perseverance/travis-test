import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserData} from '../../authentication/authentication.service';
import {UserRoleEnum} from '../enums/user-role.enum';

@Component({
	selector: 'app-purchase-agreement-step',
	templateUrl: './purchase-agreement-step.component.html',
	styleUrls: ['./purchase-agreement-step.component.scss']
})
export class PurchaseAgreementStepComponent implements OnInit {
	public userInfo: any;
	public userIsAgent = false;

	constructor(private authService: AuthenticationService) {
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
				// if (userInfo.user.role === UserRoleEnum.Agent) {
				this.userIsAgent = true;
				// }
			}
		});
	}

	ngOnInit() {
	}

}
