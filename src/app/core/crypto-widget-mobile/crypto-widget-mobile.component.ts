import { CurrencyDataService } from './../crypto-widget/currency-data.service';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-crypto-widget-mobile',
	templateUrl: './crypto-widget-mobile.component.html',
	styleUrls: ['./crypto-widget-mobile.component.scss'],
	encapsulation: ViewEncapsulation.None

})
export class CryptoWidgetMobileComponent implements OnInit {
	public cryptoData: any;
	public cryptoPrice: any;
	constructor(public currecyService: CurrencyDataService) { }

	async ngOnInit() {
		this.cryptoData = await this.currecyService.loadCurrencyData('https://api.coinmarketcap.com/v1/ticker/propy/');
		this.cryptoPrice = (+this.cryptoData.price_usd).toFixed(4);
	}


}
