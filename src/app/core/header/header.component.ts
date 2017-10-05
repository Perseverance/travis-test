import { DefaultLanguage } from './../i18nSetup';
import { environment } from './../../../environments/environment';
import { RedirectableComponent } from './../../shared/redirectable/redirectable.component';
import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../shared/localStorage.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends RedirectableComponent implements OnInit {


	constructor(
		router: Router,
		public translate: TranslateService,
		private storage: LocalStorageService) {
		super(router, environment.skippedRedirectRoutes, environment.defaultRedirectRoute);
	}

	ngOnInit() {
	}

	selectLanguage(lang: string) {
		this.translate.use(lang);
		this.storage.selectedLanguage = lang;
	}
}
