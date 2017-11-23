import {AbstractControl} from '@angular/forms';

export class WalletAddressValidator {

	static walletAddressValidator(control: AbstractControl) {
		const walletAddress = control.value;

		if (/^(0x)?[0-9a-fA-F]{40}$/.test(walletAddress)) {
			return null;
		}
		return {invalidPhoneNumber: true};
	}
}
