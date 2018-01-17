import { RestClientService } from './../../shared/rest-client.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CurrencyDataService } from './currency-data.service';

@Component({
	selector: 'app-crypto-widget',
	templateUrl: './crypto-widget.component.html',
	styleUrls: ['./crypto-widget.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class CryptoWidgetComponent implements OnInit {
	public cryptoData: any;
	constructor(public currecyService: CurrencyDataService) { }

	async ngOnInit() {
		this.cryptoData = await this.currecyService.loadCurrencyData('https://api.coinmarketcap.com/v1/ticker/propy/');
		console.log(this.cryptoData);
	}

}
