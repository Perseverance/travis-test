import { APIEndpointsService } from './../shared/apiendpoints.service';
import { RestClientService } from './../shared/rest-client.service';
import { Injectable } from '@angular/core';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable()
export class VerificationService {

	constructor(public restClient: RestClientService,
		public apiEndpoints: APIEndpointsService,
		public authService: AuthenticationService) { }

	public async sendVerificationCode(code: string) {
		const params = {
			code
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.VERIFY_ACCOUNT, params);
		await this.authService.getCurrentUser(true);
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
