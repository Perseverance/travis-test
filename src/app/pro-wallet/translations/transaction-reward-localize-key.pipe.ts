import {Pipe, PipeTransform} from '@angular/core';
import {ProWalletTranslationsService} from './pro-wallet-translations.service';

@Pipe({name: 'transactionRewardLocalizeKey'})
export class TransactionRewardLocalizeKeyPipe implements PipeTransform {

	constructor(public proWalletTranslationService: ProWalletTranslationsService) {

	}

	transform(value: number): string {
		const mainKeyPart = 'enums.transaction-reason';
		const transactionReasonKey = this.proWalletTranslationService.getTransactionReasonKey(value);
		return `${mainKeyPart}.${transactionReasonKey}`;
	}

}
