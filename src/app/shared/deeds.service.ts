import { BrowserDetectionService } from './browser-detection.service';
import { SmartContractAddress } from './../smart-contract-connection/smart-contract-connection.service';
import { APIEndpointsService } from './apiendpoints.service';
import { RestClientService } from './rest-client.service';
import { Injectable } from '@angular/core';

export enum INVITATION_STATUSES {
	INVITED = 1,
	ACCEPTED = 2,
	REJECTED = 3
}

export enum TRANSACTION_STATUSES {
	PENDING = 0,
	SUCCESS = 1,
	FAILED = 2
}

export enum BLOCKCHAIN_TRANSACTION_STEPS {
	RESERVATION = 1,
	PURCHASE_AGREEMENT = 2,
	TITLE_REPORT = 3,
	DISCLOSURES = 4,
	AFFIDAVIT = 5,
	OWNERSHIP_TRANSFER = 6
}

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
		result.data.data.transactions = {
			1: { // Reservation
				txHash: '0xafea84ff77667fb9ac23ff474b8bafe50177e8f64cab8d4899699c4b5e0b4a27',
				status: 1
			},
			2: { // Purchase Agreement
				txHash: '0xafea84ff77667fb9ac23ff474b8bafe50177e8f64cab8d4899699c4b5e0b4a27',
				status: 1
			},
			3: { // Title Report
				txHash: '0xafea84ff77667fb9ac23ff474b8bafe50177e8f64cab8d4899699c4b5e0b4a27',
				status: 1
			},
			4: { // Disclosures
				txHash: '0xafea84ff77667fb9ac23ff474b8bafe50177e8f64cab8d4899699c4b5e0b4a27',
				status: 1
			},
			5: { // Affidavit
				txHash: '0xafea84ff77667fb9ac23ff474b8bafe50177e8f64cab8d4899699c4b5e0b4a27',
				status: 1
			},
			6: { // Ownership Transffer
				txHash: '0xafea84ff77667fb9ac23ff474b8bafe50177e8f64cab8d4899699c4b5e0b4a27',
				status: 1
			}
		};
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

	public async rejectInvite(deedId: string, rejectionReason: string): Promise<any> {
		const data = {
			deedId,
			rejectionReason
		};

		const result = await this.restService.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.REJECT_PARTY, data);
		return result.data.data;
	}

	public async cancelInvite(deedId: string): Promise<any> {
		const data = {
			deedId
		};

		const result = await this.restService.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.CANCEL_INVITE, data);
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
