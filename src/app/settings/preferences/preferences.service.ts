import { APIEndpointsService } from './../../shared/apiendpoints.service';
import { RestClientService } from './../../shared/rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PreferencesService {

	constructor(public restClient: RestClientService, public apiEndpoints: APIEndpointsService) { }

	public async onSubscriptionEmailChange(userPreferences): Promise<any> {
		const data = userPreferences;
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.SUBSCRIPTIONS_EMAIL, data);
		return result.data.data;
	}

}
