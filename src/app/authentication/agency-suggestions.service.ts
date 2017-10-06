import { APIEndpointsService } from './../shared/apiendpoints.service';
import { Agency } from './../models/agency.model';
import { RestClientService } from './../shared/rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AgencySuggestionsService {

	constructor(private restService: RestClientService, private apiEndpoints: APIEndpointsService) { }

	public async getAgencySuggestions(userInput: string): Promise<Agency[]> {
		const config = {
			params: {
				name: userInput
			}
		};
		const result = await this.restService.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.AGENCY_SUGGESTIONS, config);
		return result.data.data;
	}

}
