import { APIEndpointsService } from './../shared/apiendpoints.service';
import { RestClientService } from './../shared/rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class ReserveService {

	constructor(private restService: RestClientService,
		private apiEndpoint: APIEndpointsService) { }


	public async reserveProperty(propertyId: string, token: string): Promise<any> {
		const params = {
			propertyId,
			token
		};

		return await this.restService.postWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.RESERVE_PROPERTY, {}, { params });
	}

}
