import {Pipe, PipeTransform} from '@angular/core';
import {PropertyTypeEnum} from '../enums/property-type.enum';

@Pipe({name: 'propertyTypeLocalizeKey'})
export class PopertyTypeLocalizeKeyPipe implements PipeTransform {

	transform(value: number): string {
		const mainKeyPart = 'enums.property-types';
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
				return `${mainKeyPart}.${apartmentKey}`;
			}
			case PropertyTypeEnum.SingleFamilyHome: {
				return `${mainKeyPart}.${singleFamilyHouseKey}`;
			}
			case PropertyTypeEnum.Apartment: {
				return `${mainKeyPart}.${apartmentKey}`;
			}
			case PropertyTypeEnum.Townhouse: {
				return `${mainKeyPart}.${townhouseKey}`;
			}
			case PropertyTypeEnum.Condo: {
				return `${mainKeyPart}.${condoKey}`;
			}
			case PropertyTypeEnum.Coop: {
				return `${mainKeyPart}.${coopKey}`;
			}
			case PropertyTypeEnum.Loft: {
				return `${mainKeyPart}.${loftKey}`;
			}
			case PropertyTypeEnum.TIC: {
				return `${mainKeyPart}.${ticKey}`;
			}
			case PropertyTypeEnum.Villa: {
				return `${mainKeyPart}.${villaKey}`;
			}
			case PropertyTypeEnum.SummerVilla: {
				return `${mainKeyPart}.${summerVillaKey}`;
			}
			case PropertyTypeEnum.DevelopmentOnly: {
				return `${mainKeyPart}.${developmentOnlyKey}`;
			}
			case PropertyTypeEnum.Studio: {
				return `${mainKeyPart}.${studioKey}`;
			}
			case PropertyTypeEnum.Maisonette: {
				return `${mainKeyPart}.${maisonetteKey}`;
			}
			case PropertyTypeEnum.Penthouse: {
				return `${mainKeyPart}.${penthouseKey}`;
			}
			case PropertyTypeEnum.Bungalow: {
				return `${mainKeyPart}.${bungalawKey}`;
			}
			case PropertyTypeEnum.StudentRoom: {
				return `${mainKeyPart}.${studentRoomKey}`;
			}
		}
	}
}
