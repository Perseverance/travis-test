import { APIEndpointsService } from './../shared/apiendpoints.service';
import { RestClientService } from './../shared/rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PropertiesService {

	constructor(private restService: RestClientService, private apiEndpoint: APIEndpointsService) { }

	public async getProperty(propertyId: string) {
		const params = {
			id: propertyId
		};
		const result = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.SINGLE_PROPERTY, { params });
		return result;
	}

}
