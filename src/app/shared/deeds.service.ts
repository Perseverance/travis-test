import { APIEndpointsService } from './apiendpoints.service';
import { RestClientService } from './rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DeedsService {

	constructor(private restService: RestClientService,
		private apiEndpoint: APIEndpointsService) { }


	public async sendDeedAddress(propertyId: string, deedAddress: string): Promise<boolean> {
		const params = {
			propertyId,
			deedAddress
		};

		await this.restService.postWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.CREATE_DEED, params);
		return true;
	}

}
