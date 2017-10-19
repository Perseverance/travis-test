import {Pipe, PipeTransform} from '@angular/core';
import {LocalStorageService} from '../localStorage.service';
import {CurrencyTypeEnum} from '../enums/currency-type.enum';
import {CurrencySymbolEnum} from '../enums/currency-symbol.enum';

@Pipe({name: 'currencySymbol'})
export class CurrencySymbolPipe implements PipeTransform {

	private DECIMAL_SEPARATOR: string;
	private THOUSANDS_SEPARATOR: string;

	constructor(private localStorage: LocalStorageService) {
		this.DECIMAL_SEPARATOR = '.';
		this.THOUSANDS_SEPARATOR = ',';
	}

	transform(value: number | string): string {
		const [integer] = (value || '').toString()
			.split(this.DECIMAL_SEPARATOR);

		let currencySign: string;
		switch (localStorage.selectedCurrencyType) {
			case CurrencyTypeEnum.RUB: {
				currencySign = CurrencySymbolEnum.RUB;
				break;
			}
			case CurrencyTypeEnum.AED: {
				currencySign = CurrencySymbolEnum.AED;
				break;
			}
			case CurrencyTypeEnum.CNY: {
				currencySign = CurrencySymbolEnum.CNY;
				break;
			}
			default: {
				currencySign = CurrencySymbolEnum.USD;
				break;
			}
		}
		return `${currencySign} ${integer}`;
	}
}
