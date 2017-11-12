import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit {
	private shouldShowPassword: any;
	constructor(private authService: AuthenticationService) { }

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
	}

}
