import { APIEndpointsService } from './apiendpoints.service';
import { RestClientService } from './rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AgencyService {

	constructor(public restClient: RestClientService, public apiEndpoints: APIEndpointsService) {

	}

	public async createAgency(agencyName: string): Promise<string> {
		const data = {
			name: agencyName,
			website: ''
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.AGENCY_CREATE, data);
		return result.data.data.value;
	}

}
