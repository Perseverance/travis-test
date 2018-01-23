import { AbstractControl, FormControl, ValidationErrors } from '@angular/forms';

export class CustomNumberValidator {

	static minimalNumber(number: FormControl): ValidationErrors {
		const numValue = Number(number.value);
		// minNumber is the smallest unit of ETH - WEI
		const minNumber = 0.000000000000000001;
		const isValid = numValue >= minNumber;
		if (numValue >= minNumber) {
			return null;
		}

		return { invalidEthNumber: true };
	}
}
