import {Component, OnInit} from '@angular/core';
import {ProWalletService} from './pro-wallet.service';
import {UserTransactionsHistoryResponse} from './pro-wallet-responses';

@Component({
	selector: 'app-pro-wallet',
	templateUrl: './pro-wallet.component.html',
	styleUrls: ['./pro-wallet.component.scss']
})
export class ProWalletComponent implements OnInit {
	public userTransactionsHistory: UserTransactionsHistoryResponse;
	public hasTransactions = false;

	constructor(private proWalletService: ProWalletService) {
	}

	async ngOnInit() {
		this.userTransactionsHistory = await this.proWalletService.userTransactionsHistory();
		if (this.userTransactionsHistory.transactions && this.userTransactionsHistory.transactions.length > 0) {
			this.hasTransactions = true;
		}
	}

}
