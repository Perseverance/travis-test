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


	public async sendDeedAddress(propertyId: string, deedAddress: string): Promise<boolean> {
		const params = {
			propertyId,
			deedAddress
		};

		await this.restService.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.CREATE_DEED, params);
		return true;
	}

	public async sendSellerAccept(deedAddress: SmartContractAddress) {
		const data = {
			deedAddress
		};

		const result = await this.restService.postWithURLEncodedAndToken(this.apiEndpoints.INTERNAL_ENDPOINTS.DEED_ADD_SELLER, data);
		await result.data.data;
	}

	public async sendEscrowAccept(deedAddress: SmartContractAddress) {
		const data = {
			deedAddress
		};

		const result = await this.restService.postWithURLEncodedAndToken(this.apiEndpoints.INTERNAL_ENDPOINTS.DEED_ADD_ESCROW, data);
		await result.data.data;
	}

}
