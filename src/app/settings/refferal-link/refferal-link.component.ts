import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-refferal-link',
	templateUrl: './refferal-link.component.html',
	styleUrls: ['./refferal-link.component.scss'],
	encapsulation: ViewEncapsulation.None

})
export class RefferalLinkComponent implements OnInit {
	public inviteLink: string;
	public userId: string;
	private REFERRAL_PATH = 'Users/RequestInvite?referrerId=';
	public buttonText = 'Show';

	constructor(private authService: AuthenticationService) {
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
				this.userId = userInfo.user.id;
				this.inviteLink = `${window.location.protocol}//${window.location.host}/${this.REFERRAL_PATH}${this.userId}`;
			}
		});
	}

	ngOnInit() {
	}

	changeButtonText() {
		if (this.buttonText === 'Show') {
			this.buttonText = 'Hide';
		} else {
			this.buttonText = 'Show';
		}
	}

}
