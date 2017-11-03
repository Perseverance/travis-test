import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'thousandSeparator'})
export class ThousandSeparatorPipe implements PipeTransform {

	private DECIMAL_SEPARATOR: string;
	private THOUSANDS_SEPARATOR: string;

	constructor() {
		this.DECIMAL_SEPARATOR = '.';
		this.THOUSANDS_SEPARATOR = ',';
	}

	transform(value: number | string): string {
		let [integer] = (value || '').toString()
			.split(this.DECIMAL_SEPARATOR);
		integer = integer.replace(/[^0-9.]/g, '');
		integer = integer.replace(/\B(?=(\d{3})+(?!\d))/g, this.THOUSANDS_SEPARATOR);

		if (integer === '') {
			integer = '0';
		}

		return integer;
	}
}
