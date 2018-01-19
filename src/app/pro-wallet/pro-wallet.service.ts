import {Injectable} from '@angular/core';
import {RestClientService} from '../shared/rest-client.service';
import {APIEndpointsService} from '../shared/apiendpoints.service';
import {UserTransactionsHistoryResponse} from './pro-wallet-responses';

@Injectable()
export class ProWalletService {

	constructor(public restClient: RestClientService,
				public apiEndpoints: APIEndpointsService) {
	}

	public async updateAddress(walletAddress: string) {
		const params = {
			walletAddress
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.USER_UPDATE_WALLET, {}, {params});
		return result.data.data;
	}

	public async userTransactionsHistory(): Promise<UserTransactionsHistoryResponse> {
		const result = await this.restClient.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.USER_TRANSACTION_HISTORY, {});
		return result.data.data;
	}

	public async convertStashedTokens(): Promise<any> {
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.CONVERT_STASHED_TOKENS, {});
		return result;
	}

	public async setWallet(publicKey: string, jsonFile: string, userPhone: string) {
		const params = {
			publicKey,
			jsonFile,
			userPhone
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.SET_WALLET, params);
		return result.data.data;
	}
}
