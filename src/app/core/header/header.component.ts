import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {LocalStorageService} from '../../shared/localStorage.service';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

	constructor(public translate: TranslateService,
				private storage: LocalStorageService) {
	}

	ngOnInit() {
	}

	selectLanguage(lang: string) {
		this.translate.use(lang);
		this.storage.selectedLanguage = lang;
	}
}
