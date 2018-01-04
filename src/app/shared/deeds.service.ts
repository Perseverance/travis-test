import { BrowserDetectionService } from './browser-detection.service';
import { SmartContractAddress } from './../smart-contract-connection/smart-contract-connection.service';
import { APIEndpointsService } from './apiendpoints.service';
import { RestClientService } from './rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class DeedsService {

	constructor(private restService: RestClientService,
		private apiEndpoints: APIEndpointsService,
		private browserDetectionService: BrowserDetectionService) {
	}

	public async getMyDeeds(): Promise<any> {
		const result = await this.restService.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.MY_DEEDS);
		return result.data.data;
	}

	public async getDeedDetails(deedId: string): Promise<any> {
		const params = {
			deedId
		};
		const result = await this.restService.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.GET_DEED, { params });
		return result.data.data;
	}

	public async inviteParties(deedId: string,
		buyerEmail: string,
		sellerEmail: string,
		buyerBrokerEmail: string,
		titleCompanyEmail: string,
		PriceInETH: string) {
		const data = {
			deedId,
			buyerEmail,
			sellerEmail,
			buyerBrokerEmail,
			titleCompanyEmail,
			PriceInETH
		};

		const result = await this.restService.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.INVITE_PARTY, data);
		return result.data.data;
	}


	public async acceptInvite(deedId: string): Promise<any> {
		const data = {
			deedId
		};

		const result = await this.restService.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.ACCEPT_PARTY, data);
		return result.data.data;
	}

	public async rejectInvite(deedId: string): Promise<any> {
		const data = {
			deedId
		};

		const result = await this.restService.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.REJECT_PARTY, data);
		return result.data.data;
	}

	public async markDocumentSigned(documentId: string): Promise<any> {
		const data = {
			documentId
		};

		const result = await this.restService.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.AGREE_DOCUMENT, data);
		return result.data.data;
	}

	public async markDocumentAgreed(documentId: string): Promise<any> {
		const data = {
			documentId
		};

		const result = await this.restService.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.AGREE_DOCUMENT, data);
		return result.data.data;
	}

	public async sendDocumentTxHash(id: string, txHash: string) {
		const data = {
			id,
			txHash
		};

		const result = await this.restService.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.SAVE_DOCUMENT_HASH, data);
		return result.data.data;
	}

}
