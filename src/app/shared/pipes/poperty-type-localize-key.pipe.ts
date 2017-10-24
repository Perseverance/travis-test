import {Pipe, PipeTransform} from '@angular/core';
import {PropertyTypeEnum} from '../enums/property-type.enum';

@Pipe({name: 'propertyTypeLocalizeKey'})
export class PopertyTypeLocalizeKeyPipe implements PipeTransform {

	transform(value: number): string {
		const mainKeyPart = 'enums.property-types';
		const propertyTypeKey = this.getPropertyTypeKey(value);
		return `${mainKeyPart}.${propertyTypeKey}`;
	}

	private getPropertyTypeKey(value: number): string {
		const apartmentKey = 'apartment';
		const singleFamilyHouseKey = 'single-family-house';
		const townhouseKey = 'townhouse';
		const condoKey = 'condo';
		const coopKey = 'coop';
		const loftKey = 'loft';
		const ticKey = 'tic';
		const villaKey = 'villa';
		const summerVillaKey = 'summer-villa';
		const developmentOnlyKey = 'development-only';
		const studioKey = 'studio';
		const maisonetteKey = 'maisonette';
		const penthouseKey = 'penthouse';
		const bungalawKey = 'bungalow';
		const studentRoomKey = 'student-room';

		switch (value) {
			case PropertyTypeEnum.BrokenValue: {
				return `${apartmentKey}`;
			}
			case PropertyTypeEnum.SingleFamilyHome: {
				return `${singleFamilyHouseKey}`;
			}
			case PropertyTypeEnum.Apartment: {
				return `${apartmentKey}`;
			}
			case PropertyTypeEnum.Townhouse: {
				return `${townhouseKey}`;
			}
			case PropertyTypeEnum.Condo: {
				return `${condoKey}`;
			}
			case PropertyTypeEnum.Coop: {
				return `${coopKey}`;
			}
			case PropertyTypeEnum.Loft: {
				return `${loftKey}`;
			}
			case PropertyTypeEnum.TIC: {
				return `${ticKey}`;
			}
			case PropertyTypeEnum.Villa: {
				return `${villaKey}`;
			}
			case PropertyTypeEnum.SummerVilla: {
				return `${summerVillaKey}`;
			}
			case PropertyTypeEnum.DevelopmentOnly: {
				return `${developmentOnlyKey}`;
			}
			case PropertyTypeEnum.Studio: {
				return `${studioKey}`;
			}
			case PropertyTypeEnum.Maisonette: {
				return `${maisonetteKey}`;
			}
			case PropertyTypeEnum.Penthouse: {
				return `${penthouseKey}`;
			}
			case PropertyTypeEnum.Bungalow: {
				return `${bungalawKey}`;
			}
			case PropertyTypeEnum.StudentRoom: {
				return `${studentRoomKey}`;
			}
		}
	}
}
