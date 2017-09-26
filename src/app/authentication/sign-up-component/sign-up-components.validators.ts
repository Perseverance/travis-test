import { AbstractControl } from '@angular/forms';


export class SignUpFormValidators {
	static differentPasswordsValidator(control: AbstractControl) {
		const passValue = control.get('password').value;
		const repeatPassValue = control.get('repeatPassword').value;

		const samePasswords = repeatPassValue === passValue;

		return samePasswords ? null : { passwordsDiffer: true };
	}

	static passwordSymbolsValidator(control: AbstractControl) {
		const password = control.value;

		const testPattern = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$'; // Comming from here: https://stackoverflow.com/a/21456918/1374825
		const isPasswordValid = (new RegExp(testPattern)).test(password);
		return isPasswordValid ? null : { invalidPasswordSymbols: true };
	}
}
