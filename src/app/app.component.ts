import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './authentication/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from './shared/localStorage.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	constructor(private authService: AuthenticationService,
				public translate: TranslateService,
				private localStorage: LocalStorageService) {

		translate.addLangs(['en', 'chn']);
		// this language will be used as a fallback when a translation isn't found in the current language
		translate.setDefaultLang('en');

		// the lang to use, if the lang isn't available, it will use the current loader to get them
		translate.use(localStorage.selectedLanguage);
	}

	async ngOnInit() {

		if (this.authService.hasUserLoggedIn) {
			await this.authService.refreshStoredAccessToken();
		} else {
			await this.authService.performAnonymousLogin();
		}
	}
}
