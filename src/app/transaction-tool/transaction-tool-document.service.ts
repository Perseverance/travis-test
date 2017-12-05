import {Injectable} from '@angular/core';
import {APIEndpointsService} from '../shared/apiendpoints.service';
import {RestClientService} from '../shared/rest-client.service';
import {SmartContractConnectionService} from '../smart-contract-connection/smart-contract-connection.service';

@Injectable()
export class TransactionToolDocumentService {

	constructor(private restService: RestClientService,
				private apiEndpoint: APIEndpointsService,
				private smartContractService: SmartContractConnectionService) {
	}

	public async uploadTransactionToolDocument(deedDocumentType: number, deedAddress: string, fileBase64: string): Promise<any> {
		const params = {
			DeedDocumentType: deedDocumentType,
			DeedAddress: deedAddress,
			FileBase64: fileBase64
		};

		const response = await this.restService.postWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.UPLOAD_DEED_DOCUMENT, params);
		this.smartContractService.markPurchaseAgreementUploaded(response.data.data.requestSignatureId);
		return response.data.data;
	}

	public async getDownloadDocumentLink(requestSignatureId: string): Promise<any> {
		const params = {
			requestSignatureId: requestSignatureId
		};

		const response = await this.restService.getWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.GET_DOWNLOAD_DOCUMENT_LINK, {params});
		return response.data.data;
	}
}
