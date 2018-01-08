import { APIEndpointsService } from './../shared/apiendpoints.service';
import { RestClientService } from './../shared/rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class VerificationService {

	constructor(public restClient: RestClientService,
		public apiEndpoints: APIEndpointsService) { }

	public async sendVerificationCode(code: string) {
		const params = {
			code
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.VERIFY_ACCOUNT, params);
		return result.data.data;
	}

	public async resendVerficiation(email: string) {
		const params = {
			email
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.RESEND_VERIFY_ACCOUNT, params);
		return result.data.data;
	}

}
