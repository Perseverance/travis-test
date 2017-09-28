import { APIEndpointsService } from './../../shared/apiendpoints.service';
import { RestClientService } from './../../shared/rest-client.service';
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

	static emailTakenValidator(restService: RestClientService, apiService: APIEndpointsService) {
		return (control: AbstractControl) => {
			const config = {
				params: {
					email: control.value
				}
			};
			return restService.get(apiService.INTERNAL_ENDPOINTS.EMAIL_AVAILABLE, config)
				.then(res => {
					const isTaken = res.data.data;
					return isTaken ? { emailTaken: true } : null;
				})
				.catch(error => {
					return null;
				});
		};
	}
}
