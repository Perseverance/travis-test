import {APIEndpointsService} from './../shared/apiendpoints.service';
import {RestClientService} from './../shared/rest-client.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthenticationService {

	constructor(private restClient: RestClientService, private apiEndpoints: APIEndpointsService) {
	}

	public performSignUp(email: string, password: string, firstName: string, lastName: string) {
		const data = {
			email,
			password,
			firstName,
			lastName
		};
		return this.restClient.post(this.apiEndpoints.INTERNAL_ENDPOINTS.REGISTER, data);
	}

}
