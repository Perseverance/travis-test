import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { APIEndpointsService } from '../shared/apiendpoints.service';
import { RestClientService } from '../shared/rest-client.service';
import { SmartContractConnectionService } from '../smart-contract-connection/smart-contract-connection.service';

@Injectable()
export class LoadPropertyService {

	constructor(private restService: RestClientService,
		private apiEndpoint: APIEndpointsService) {
	}

	public async getProperty(deedId: string): Promise<any> {
		const params = {
			deedId
		};

		const response = await this.restService.getWithAccessToken(
			this.apiEndpoint.INTERNAL_ENDPOINTS.PROPERTY_PREVIEW, { params });
		return response.data.data;
	}
}
