import { RestClientService } from './../../shared/rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class CurrencyDataService {

	constructor(private restService: RestClientService) { }

	public async loadCurrencyData(url: string) {
		const responce = await this.restService.consumeGetDataApi(url);
		return responce.data[0];
	}
}
