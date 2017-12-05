import {GoogleAnalyticsEventsService} from './shared/google-analytics.service';
import {Router, NavigationEnd} from '@angular/router';
import {environment} from './../environments/environment';
import {Component, OnInit} from '@angular/core';
import {AuthenticationService, UserData} from './authentication/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from './shared/localStorage.service';
import {AllSupportedLanguage, DefaultLanguage} from './core/i18nSetup';
import {CurrencyTypeEnum} from './shared/enums/currency-type.enum';
import {MomentService} from './shared/moment.service';
import {Intercom} from 'ng2-intercom/intercom';
import {default as smartlookClient} from 'smartlook-client';
import {PusherService} from './shared/pusher.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(public authService: AuthenticationService,
				public translateService: TranslateService,
				private localStorageService: LocalStorageService,
				private momentService: MomentService,
				private intercom: Intercom,
				public router: Router,
				public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
				public pusherService: PusherService) {

		translateService.addLangs(AllSupportedLanguage);
		// this language will be used as a fallback when a translation isn't found in the current language
		translateService.setDefaultLang(DefaultLanguage);

		// the lang to use, if the lang isn't available, it will use the default language
		translateService.use(localStorageService.selectedLanguage);
		this.momentService.moment.locale([localStorageService.selectedLanguage, DefaultLanguage]);
		localStorageService.selectedCurrencyType = CurrencyTypeEnum.NONE;

		// ToDo: Comment out when start to use pusher
		// this.authService.subscribeToUserData({
		// 	next: (userInfo: UserData) => {
		// 		if (!userInfo.isAnonymous) {
		// 			this.pusherService.initializePusher(localStorageService.accessToken, userInfo.user.id);
		// 		}
		// 	}
		// });
	}

	ngOnInit() {
		this.googleAnalyticsEventsService.emitEvent('page-category', 'page');
		if (environment.production) {
			smartlookClient.init(environment.smartLookId);
		}
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.isAnonymous) {
					this.intercom.init({
						app_id: environment.intercomClientId,
						name: 'Anonymous'
					});
					return;
				}
				this.intercom.init({
					app_id: environment.intercomClientId,
					name: `${userInfo.user.firstName} ${userInfo.user.lastName}`,
					email: userInfo.user.email
				});
			}
		});
	}
}
