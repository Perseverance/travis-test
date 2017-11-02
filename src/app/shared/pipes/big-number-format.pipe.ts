import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'bigNumberFormat'})
export class BigNumberFormatPipe implements PipeTransform {
	transform(value: string, hasCurrencySymbol?: boolean): string {
		let returnValue: string;
		let currencySymbol: string;
		let isFormatted = true;
		if (value !== undefined) {
			if (hasCurrencySymbol) {
				// Get value without currency symbol
				currencySymbol = value.substr(0, value.indexOf(' '));
				value = value.substr(value.indexOf(' ') + 1);
			}

			const abs = Math.abs(+value);
			if (abs >= Math.pow(10, 12)) {
				// trillion
				returnValue = (+value / Math.pow(10, 12)).toFixed(1) + 'T';
			} else if (abs >= Math.pow(10, 9)) {
				// billion
				returnValue = (+value / Math.pow(10, 9)).toFixed(1) + 'B';
			} else if (abs >= Math.pow(10, 6)) {
				// million
				returnValue = (+value / Math.pow(10, 6)).toFixed(1) + 'M';
			} else if (abs >= Math.pow(10, 3)) {
				// thousand
				returnValue = (+value / Math.pow(10, 3)).toFixed(1) + 'K';
			}

			if (returnValue === undefined) {
				isFormatted = false;
			}

			if (currencySymbol) {
				value = `${currencySymbol} ${value}`;
				returnValue = `${currencySymbol} ${returnValue}`;
			}

			return isFormatted ? returnValue : value;
		}
	}
}
