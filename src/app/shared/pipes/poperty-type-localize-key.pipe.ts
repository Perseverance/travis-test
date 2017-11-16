import { PropertyConversionService } from './../property-conversion.service';
import { Pipe, PipeTransform } from '@angular/core';
import { PropertyTypeEnum } from '../enums/property-type.enum';

@Pipe({ name: 'propertyTypeLocalizeKey' })
export class PopertyTypeLocalizeKeyPipe implements PipeTransform {

	constructor(public propertyConversionService: PropertyConversionService) {

	}

	transform(value: number): string {
		const mainKeyPart = 'enums.property-types';
		const propertyTypeKey = this.propertyConversionService.getPropertyTypeKey(value);
		return `${mainKeyPart}.${propertyTypeKey}`;
	}

}
