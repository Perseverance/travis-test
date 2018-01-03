import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { Component, OnInit, ViewEncapsulation, OnChanges } from '@angular/core';


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
	public buttonLabelHide = false;
	public buttonLabels: object;
	public buttonTextLabelShow: string;
	public buttonTextLabelHide: string;

	constructor(private authService: AuthenticationService, private translateService: TranslateService, ) {
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
		this.translateService.stream([
			'settings.refferal-program.refferal-show',
			'settings.refferal-program.refferal-hide',
		]).subscribe((translations) => {
			this.buttonTextLabelShow = translations['settings.refferal-program.refferal-show'],
				this.buttonTextLabelHide = translations['settings.refferal-program.refferal-hide']
		});
	}

	changeButtonText() {
		this.buttonLabelHide = !this.buttonLabelHide;
	}

}
