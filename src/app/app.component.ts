import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './authentication/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from './shared/localStorage.service';
import {AllSupportedLanguage, DefaultLanguage} from './core/i18nSetup';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

	constructor(public authService: AuthenticationService,
				public translate: TranslateService,
				private localStorage: LocalStorageService) {

		translate.addLangs(AllSupportedLanguage);
		// this language will be used as a fallback when a translation isn't found in the current language
		translate.setDefaultLang(DefaultLanguage);

		// the lang to use, if the lang isn't available, it will use the default language
		translate.use(localStorage.selectedLanguage);
		localStorage.selectedCurrencyType = 0;
	}

	ngOnInit() {
	}
}
