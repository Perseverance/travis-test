import {APIEndpointsService} from './../shared/apiendpoints.service';
import {RestClientService} from './../shared/rest-client.service';
import {Injectable} from '@angular/core';
import {GetPropertiesResponse} from './properties-responses';

interface Bounds {
	east: number;
	west: number;
	north: number;
	south: number;
}


@Injectable()
export class PropertiesService {

	constructor(private restService: RestClientService, private apiEndpoint: APIEndpointsService) {
	}

	public async getProperty(propertyId: string) {
		const params = {
			id: propertyId
		};
		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.SINGLE_PROPERTY, {params});
		return result;
	}

	public async getPropertiesInRectangle(latitude: number, longitude: number, degreesOfIncreaseArea = 1): Promise<GetPropertiesResponse> {
		const bounds: Bounds = this.createRectangleBounds(latitude, longitude, degreesOfIncreaseArea);
		const query = this.propertiesInRectangleQueryFormat(bounds);
		const params = {
			search: query
		};

		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.PROPERTIES_BY_RECTANGLE, {params});
		return {properties: result.data.data.properties};
	}

	private createRectangleBounds(latitude: number, longitude: number, degreesOfIncreaseArea = 1) {
		const bounds: Bounds = {
			north: latitude + degreesOfIncreaseArea,
			south: latitude - degreesOfIncreaseArea,
			east: longitude + degreesOfIncreaseArea,
			west: longitude - degreesOfIncreaseArea
		};
		return bounds;
	}

	private propertiesInRectangleQueryFormat(bounds) {
		const querySuffix = '_coords/1,25_page/';
		const query = `/${bounds.south},${bounds.north},${bounds.west},${bounds.east}${querySuffix}`;
		return query;
	}
}
