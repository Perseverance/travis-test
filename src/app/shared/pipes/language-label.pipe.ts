import {Pipe, PipeTransform} from '@angular/core';
import {LanguagesEnum} from '../enums/supported-languages.enum';

@Pipe({name: 'languageLabel'})
export class LanguageLabelPipe implements PipeTransform {
	transform(languageCode: string) {
		const chineseLabel = '中文';
		if (languageCode === LanguagesEnum.CHINESE) {
			return chineseLabel;
		}
		return languageCode.toLocaleUpperCase();
	}
}
