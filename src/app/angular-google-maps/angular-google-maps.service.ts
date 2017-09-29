import {APIEndpointsService} from './../shared/apiendpoints.service';
import {RestClientService} from './../shared/rest-client.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AngularGoogleMapsService {

	constructor(private restClient: RestClientService, private apiEndpoints: APIEndpointsService) {
	}

	public async getPropertiesInRectangle(latitude: number, longitude: number) {
		const querySuffix = '_coords/1,25_page/';
		const bounds = this.createRectangleBounds(latitude, longitude);
		const query = `${bounds.south},${bounds.north},${bounds.west},${bounds.east}${querySuffix}`;

		const config = {
			params: {
				search: query
			}
		};

		const result = await this.restClient.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.PROPERTIES_BY_RECTANGLE, config);
		return result.data.data.properties;
	}

	private createRectangleBounds(latitude: number, longitude: number) {
		const degreesOfIncreaseAreaOfRectangle = 1;
		const bounds = {
			north: latitude + degreesOfIncreaseAreaOfRectangle,
			south: latitude - degreesOfIncreaseAreaOfRectangle,
			east: longitude + degreesOfIncreaseAreaOfRectangle,
			west: longitude - degreesOfIncreaseAreaOfRectangle
		};
		return bounds;
	}

}
