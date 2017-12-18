import { async } from '@angular/core/testing';
import { Injectable } from '@angular/core';
import { APIEndpointsService } from '../shared/apiendpoints.service';
import { RestClientService } from '../shared/rest-client.service';
import { SmartContractConnectionService } from '../smart-contract-connection/smart-contract-connection.service';

@Injectable()
export class TransactionToolDocumentService {

	constructor(private restService: RestClientService,
		private apiEndpoint: APIEndpointsService,
		private smartContractService: SmartContractConnectionService) {
	}

	public async uploadTransactionToolDocument(type: number, deedId: string, fileBase64: string): Promise<any> {
		const params = {
			type: type,
			deedId: deedId,
			FileBase64: fileBase64
		};

		const response = await this.restService.postWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.UPLOAD_DEED_DOCUMENT, params);
		return response.data.data;
	}

	public async getPreviewDocumentLink(requestSignatureId: string): Promise<any> {
		const params = {
			requestSignatureId: requestSignatureId
		};

		const response = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.GET_DOWNLOAD_DOCUMENT_LINK, { params });
		return response.data.data;
	}

	public async getSignUrl(requestSignatureId: string): Promise<any> {
		const params = {
			requestSignatureId: requestSignatureId
		};

		const response = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.GET_SIGN_URL, { params });
		return response.data.data;
	}

	public async getDocumentData(previewLink: string) {
		const result = await this.restService.download(previewLink);
		return result.data;
	}
}
