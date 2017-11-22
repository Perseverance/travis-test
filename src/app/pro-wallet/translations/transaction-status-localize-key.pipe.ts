import {Pipe, PipeTransform} from '@angular/core';
import {ProWalletTranslationsService} from './pro-wallet-translations.service';

@Pipe({name: 'transactionStatusLocalizeKey'})
export class TransactionStatusLocalizeKeyPipe implements PipeTransform {

	constructor(public proWalletTranslationService: ProWalletTranslationsService) {

	}

	transform(value: number): string {
		const mainKeyPart = 'enums.transaction-status';
		const transactionStatusKey = this.proWalletTranslationService.getTransactionStatusKey(value);
		return `${mainKeyPart}.${transactionStatusKey}`;
	}

}
