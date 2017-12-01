import {Injectable} from '@angular/core';
import {APIEndpointsService} from '../../shared/apiendpoints.service';
import {RestClientService} from '../../shared/rest-client.service';
import {SmartContractConnectionService} from '../../smart-contract-connection/smart-contract-connection.service';

@Injectable()
export class UploadDocumentService {
	constructor(private restService: RestClientService,
				private apiEndpoint: APIEndpointsService,
				private smartContractService: SmartContractConnectionService) {
	}


	public async uploadTransactionToolDocument(deedDocumentType: number, deedAddress: string, fileBase64: string): Promise<boolean> {
		const params = {
			DeedDocumentType: deedDocumentType,
			DeedAddress: deedAddress,
			FileBase64: fileBase64
		};

		const response = await this.restService.postWithAccessToken(this.apiEndpoint.INTERNAL_ENDPOINTS.UPLOAD_DEED_DOCUMENT, params);
		console.log(response.data);
		this.smartContractService.markPurchaseAgreementUploaded(response.data.data.requestSignatureId);
		return true;
	}
}
