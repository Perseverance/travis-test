import {Injectable} from '@angular/core';
import {RestClientService} from '../shared/rest-client.service';
import {APIEndpointsService} from '../shared/apiendpoints.service';
import {UserTransactionsHistoryResponse} from './pro-wallet-responses';

@Injectable()
export class ProWalletService {

	constructor(public restClient: RestClientService,
				public apiEndpoints: APIEndpointsService) {
	}

	public async userTransactionsHistory(): Promise<UserTransactionsHistoryResponse> {
		const result = await this.restClient.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.USER_TRANSACTION_HISTORY, {});
		return result.data.data;
	}
}
