import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { Web3Service } from '../../web3/web3.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
	public shouldShowPassword: any;

	constructor(private authService: AuthenticationService,
		private web3Service: Web3Service) {
	}

	ngOnInit() {
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.user === null) {
					this.shouldShowPassword = true;
				} else if (userInfo.user.externalLoginProviders === null) {
					this.shouldShowPassword = true;
				} else {
					this.shouldShowPassword = userInfo.user.externalLoginProviders.length === 0;
				}
			}
		});
		this.web3Service.web3InstanceLoaded({
			next: (web3Loaded: boolean) => {
				this.getMetamaskAccounts();
			}
		});
	}

	private getMetamaskAccounts() {
		this.web3Service.getMetmaskAccounts().subscribe({
			error: (err) => {
				console.error(err);
			},
			next: (accs) => {
				console.log(accs);
			},
			complete: () => { }
		});
	}

}
