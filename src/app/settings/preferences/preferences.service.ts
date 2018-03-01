import { AuthenticationService } from './../../authentication/authentication.service';
import { APIEndpointsService } from './../../shared/apiendpoints.service';
import { RestClientService } from './../../shared/rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class PreferencesService {

	constructor(public restClient: RestClientService, public apiEndpoints: APIEndpointsService, public authService: AuthenticationService) { }

	public async onSubscriptionUserChange(userPreferences): Promise<any> {
		const data = userPreferences;
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.SUBSCRIPTIONS, data);
		return result.data.data;
	}

	public async emailUnsubscribe(code: string, email: string) {
		const params = {
			code,
			email
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.VERIFY_ACCOUNT, params);
		await this.authService.getCurrentUser(true);
		return result.data.data;
	}

}
