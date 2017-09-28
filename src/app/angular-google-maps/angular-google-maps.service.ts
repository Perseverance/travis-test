import {APIEndpointsService} from './../shared/apiendpoints.service';
import {RestClientService} from './../shared/rest-client.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AngularGoogleMapsService {
	public propertiesInRectangle: any;

	constructor(private restClient: RestClientService, private apiEndpoints: APIEndpointsService) {
	}

	public async getPropertiesInRectangle(latitude: Number, longitude: Number) {
		const queryPrefix = 'search=/';
		const querySufix = '_coords/1,25_page/';
		const bounds = this.createRectangleBounds(latitude, longitude);
		const query = queryPrefix + bounds.south + ',' + bounds.north + ',' + bounds.west + ',' + bounds.east + querySufix;

		const result = await this.restClient.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.PROPERTIES_BY_RECTANGLE + query);
		this.propertiesInRectangle = result.data.data.properties;
	}

	private createRectangleBounds(latitude: any, longitude: any) {
		const degreesOfIncreaseAreaOfRectangle: any = 1;
		const bounds = {
			north: latitude + degreesOfIncreaseAreaOfRectangle,
			south: latitude - degreesOfIncreaseAreaOfRectangle,
			east: longitude + degreesOfIncreaseAreaOfRectangle,
			west: longitude - degreesOfIncreaseAreaOfRectangle
		};
		return bounds;
	}

}
