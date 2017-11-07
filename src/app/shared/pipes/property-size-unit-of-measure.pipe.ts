import {Pipe, PipeTransform} from '@angular/core';
import {LocalStorageService} from '../localStorage.service';
import {LanguagesEnum} from '../enums/supported-languages.enum';

export enum PropertySizeUnitEnum {
	SQM = 1,
	SQFT = 2
}

@Pipe({
	name: 'sizeUnitOfMeasure',
	pure: false
})
export class PropertySizeUnitOfMeasurePipe implements PipeTransform {
	constructor(private localStorageService: LocalStorageService) {
	}

	transform(value: string): string {
		const sqmSymbol = 'm²';
		const sqftSymbol = 'ft²';
		if (value === undefined) {
			return;
		}
		const responseSizeValue = Math.abs(+value);
		const sizeType = this.getSizeTypeByLanguage();
		// ToDo: implement logic with stored property size unit of measure in local storage
		switch (sizeType) {
			case PropertySizeUnitEnum.SQM: {
				const upRoundedValue = Math.ceil(responseSizeValue);
				return `${upRoundedValue} ${sqmSymbol}`;
			}
			case PropertySizeUnitEnum.SQFT: {
				const upRoundedValue = Math.ceil(responseSizeValue);
				return `${upRoundedValue} ${sqftSymbol}`;
			}
			default: {
				return value;
			}
		}
	}

	private getSizeTypeByLanguage() {
		const currentLanguage = this.localStorageService.selectedLanguage;

		switch (currentLanguage) {
			case LanguagesEnum.RUSSIAN: {
				return PropertySizeUnitEnum.SQM;
			}
			case LanguagesEnum.ARABIC: {
				return PropertySizeUnitEnum.SQM;
			}
			case LanguagesEnum.CHINESE: {
				return PropertySizeUnitEnum.SQM;
			}
			default: {
				return PropertySizeUnitEnum.SQFT;
			}
		}
	}
}
