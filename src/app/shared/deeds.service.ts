import { BrowserDetectionService } from './browser-detection.service';
import { SmartContractAddress } from './../smart-contract-connection/smart-contract-connection.service';
import { APIEndpointsService } from './apiendpoints.service';
import { RestClientService } from './rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DeedsService {

	constructor(private restService: RestClientService,
		private apiEndpoints: APIEndpointsService,
		private browserDetectionService: BrowserDetectionService) { }

	public async getMyDeeds(): Promise<any> {
		const result = await this.restService.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.MY_DEEDS);
		return result.data.data;
	}

	public async getDeedDetails(deedId: string): Promise<any> {
		const params = {
			deedId
		};
		const result = await this.restService.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.MY_DEEDS, { params });
		return result.data.data;
	}

	public async inviteParty(role: number, deedId: string, userEmail: string) {
		const data = {
			role,
			deedId,
			userEmail
		};

		const result = await this.restService.postWithURLEncodedAndToken(this.apiEndpoints.INTERNAL_ENDPOINTS.INVITE_PARTY, data);
		await result.data.data;
	}


	public async acceptInvite(deedId: string) {
		const data = {
			deedId
		};

		const result = await this.restService.postWithURLEncodedAndToken(this.apiEndpoints.INTERNAL_ENDPOINTS.ACCEPT_PARTY, data);
		await result.data.data;
	}

	public async rejectInvite(deedId: string) {
		const data = {
			deedId
		};

		const result = await this.restService.postWithURLEncodedAndToken(this.apiEndpoints.INTERNAL_ENDPOINTS.REJECT_PARTY, data);
		await result.data.data;
	}

}
