import {Pipe, PipeTransform} from '@angular/core';

export enum PropertySizeUnitEnum {
	SQM = 1,
	SQFT = 2
}

@Pipe({name: 'sizeUnitOfMeasure'})
export class PropertySizeUnitOfMeasurePipe implements PipeTransform {
	transform(value: string, sizeType: string): string {
		const sqmSymbol = 'm²';
		const sqftSymbol = 'ft²';
		let returnValue: string;
		if (value !== undefined && sizeType !== undefined) {
			const responseSizeValue = Math.abs(+value);
			const responseSizeType = Math.abs(+sizeType);
			// ToDo: implement logic with stored property size unit of measure in local storage
			switch (responseSizeType) {
				case PropertySizeUnitEnum.SQM: {
					const upRoundedValue = Math.ceil(responseSizeValue);
					returnValue = `${upRoundedValue} ${sqmSymbol}`;
					break;
				}
				case PropertySizeUnitEnum.SQFT: {
					const upRoundedValue = Math.ceil(responseSizeValue);
					returnValue = `${upRoundedValue} ${sqftSymbol}`;
					break;
				}
			}
			return returnValue ? returnValue : value;
		}
	}
}
