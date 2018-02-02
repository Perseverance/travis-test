import { TranslateLoader } from '@ngx-translate/core';
import { Observable } from 'rxjs/Observable';

export class WebpackTranslateLoader implements TranslateLoader {
	getTranslation(lang: string): Observable<any> {
		return Observable.fromPromise(System.import(`./assets/i18n/${lang}.json`));
	}
}
