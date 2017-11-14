import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from './authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from './shared/localStorage.service';
import { AllSupportedLanguage, DefaultLanguage } from './core/i18nSetup';
import { CurrencyTypeEnum } from './shared/enums/currency-type.enum';
import { MomentService } from './shared/moment.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	constructor(public authService: AuthenticationService,
		public translateService: TranslateService,
		private localStorageService: LocalStorageService,
		private momentService: MomentService) {

		translateService.addLangs(AllSupportedLanguage);
		// this language will be used as a fallback when a translation isn't found in the current language
		translateService.setDefaultLang(DefaultLanguage);

		// the lang to use, if the lang isn't available, it will use the default language
		translateService.use(localStorageService.selectedLanguage);
		this.momentService.moment.locale([localStorageService.selectedLanguage, DefaultLanguage]);
		localStorageService.selectedCurrencyType = CurrencyTypeEnum.NONE;
	}

	ngOnInit() {
	}
}
