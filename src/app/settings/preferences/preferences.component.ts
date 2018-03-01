import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { PreferencesService } from './preferences.service';

@Component({
	selector: 'app-preferences',
	templateUrl: './preferences.component.html',
	styleUrls: ['./preferences.component.scss'],
	encapsulation: ViewEncapsulation.None

})
export class PreferencesComponent implements OnInit {
	public subscriptionsPropertyForm: FormGroup;
	public currentUser;
	constructor(private formBuilder: FormBuilder, private authService: AuthenticationService, private preferencesService: PreferencesService) {
		this.authService.subscribeToUserData({
			next: async (userInfo: UserData) => {
				if (!userInfo.user) {
					return;
				}
				this.currentUser = userInfo.user;
			}
		});

		this.subscriptionsPropertyForm = this.formBuilder.group({
			notifications: [this.currentUser.preferences.receiveEmailNotifications],
			newsletter: [{ value: '', disabled: true }],
		});
	}

	ngOnInit() {
	}
	public get notifications() {
		return this.subscriptionsPropertyForm.get('notifications');
	}
	public get newsletter() {
		return this.subscriptionsPropertyForm.get('newsletter');
	}
	public saveChanges() {
		const request = {
			receiveEmailNotifications: (this.notifications.value),
			// TO DO add here another object elements to be sent when we implement another subscriptions
		};
		this.preferencesService.onSubscriptionEmailChange(request);
	}

}
