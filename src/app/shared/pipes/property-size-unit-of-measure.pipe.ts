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
		const oneSqmEqualToSqft = 10.7639104;
		if (value === undefined) {
			return;
		}
		const responseSizeValue = Math.abs(+value);
		const sizeType = this.getSizeTypeByLanguage();
		switch (sizeType) {
			case PropertySizeUnitEnum.SQM: {
				const upRoundedValue = Math.ceil(responseSizeValue);
				return `${upRoundedValue} ${sqmSymbol}`;
			}
			case PropertySizeUnitEnum.SQFT: {
				const sqmMultipliedSqftFactor = Math.ceil(responseSizeValue) * oneSqmEqualToSqft;
				const upRoundedValue = Math.ceil(sqmMultipliedSqftFactor);
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
