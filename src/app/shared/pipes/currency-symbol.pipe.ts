import { Pipe, PipeTransform } from '@angular/core';
import { LocalStorageService } from '../localStorage.service';
import { CurrencyTypeEnum } from '../enums/currency-type.enum';
import { CurrencySymbolEnum } from '../enums/currency-symbol.enum';

@Pipe({ name: 'currencySymbol' })
export class CurrencySymbolPipe implements PipeTransform {

	private DECIMAL_SEPARATOR: string;
	private THOUSANDS_SEPARATOR: string;

	constructor(private localStorageService: LocalStorageService) {
		this.DECIMAL_SEPARATOR = '.';
		this.THOUSANDS_SEPARATOR = ',';
	}

	transform(value: number | string, currencyType?: number): string {

		if (!currencyType) {
			currencyType = this.localStorageService.selectedCurrencyType;
		}
		let currencySign: string;
		switch (currencyType) {
			case CurrencyTypeEnum.EUR: {
				currencySign = CurrencySymbolEnum.EUR;
				break;
			}
			case CurrencyTypeEnum.RUB: {
				currencySign = CurrencySymbolEnum.RUB;
				break;
			}
			case CurrencyTypeEnum.AED: {
				currencySign = CurrencySymbolEnum.AED;
				break;
			}
			case CurrencyTypeEnum.HKD: {
				currencySign = CurrencySymbolEnum.HKD;
				break;
			}
			case CurrencyTypeEnum.SGD: {
				currencySign = CurrencySymbolEnum.SGD;
				break;
			}
			case CurrencyTypeEnum.GBP: {
				currencySign = CurrencySymbolEnum.GBP;
				break;
			}
			case CurrencyTypeEnum.BGN: {
				currencySign = CurrencySymbolEnum.BGN;
				break;
			}
			case CurrencyTypeEnum.CNY: {
				currencySign = CurrencySymbolEnum.CNY;
				break;
			}
			case CurrencyTypeEnum.ETH: {
				currencySign = CurrencySymbolEnum.ETH;
				break;
			}
			case CurrencyTypeEnum.BTC: {
				currencySign = CurrencySymbolEnum.BTC;
				break;
			}
			default: {
				currencySign = CurrencySymbolEnum.USD;
				break;
			}
		}
		return `${currencySign} ${value}`;
	}
}
