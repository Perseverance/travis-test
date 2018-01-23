import { RestClientService } from './../../shared/rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CurrencyDataService {

	constructor(private restService: RestClientService) { }

	public async loadCurrencyData(url: string) {
		const response = await this.restService.consumeGetDataApi(url);
		return response.data[0];
	}
}
