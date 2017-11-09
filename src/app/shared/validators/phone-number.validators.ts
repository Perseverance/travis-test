import { AbstractControl } from '@angular/forms';

export class PhoneNumberValidators {

	static phoneNumberValidator(control: AbstractControl) {
		const phoneNumber = control.value;

		const testPattern = '\\(?\\+[0-9]{1,3}\\)? ?-?[0-9]{1,3} ?-?[0-9]{3,5} ?-?[0-9]{4}( ?-?[0-9]{3})?';
		// Comming from here: https://stackoverflow.com/a/18626090/1374825
		const isPhoneNumberValid = (new RegExp(testPattern)).test(phoneNumber);
		return isPhoneNumberValid ? null : { invalidPhoneNumber: true };
	}

}
