import {Pipe, PipeTransform} from '@angular/core';
import {LocalStorageService} from '../localStorage.service';

@Pipe({name: 'customNumberFormatting'})
export class CustomNumberFormattingPipe implements PipeTransform {

	private DECIMAL_SEPARATOR: string;
	private THOUSANDS_SEPARATOR: string;

	constructor(private localStorage: LocalStorageService) {
		this.DECIMAL_SEPARATOR = '.';
		this.THOUSANDS_SEPARATOR = ',';
	}

	transform(value: number | string, showCurrencySymbol: boolean): string {
		let [integer] = (value || '').toString()
			.split(this.DECIMAL_SEPARATOR);

		integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

		if (showCurrencySymbol) {
			let currencySign: string;
			switch (localStorage.selectedCurrencyType) {
				case '1': {
					currencySign = '$';
					break;
				}
				case '3': {
					currencySign = '₽';
					break;
				}
				case '4': {
					currencySign = '\tد.إ';
					break;
				}
				case '9': {
					currencySign = '¥';
					break;
				}
				default: {
					currencySign = '$';
					break;
				}
			}

			return currencySign + ' ' + integer;
		}

		return integer;
	}
}
