import {APIEndpointsService} from './../shared/apiendpoints.service';
import {RestClientService} from './../shared/rest-client.service';
import {Injectable} from '@angular/core';

@Injectable()
export class AngularGoogleMapsService {

	constructor(private restClient: RestClientService, private apiEndpoints: APIEndpointsService) {
	}

	public getPropertiesInRectangle(rect: Object) {
		// just for test
		const query = 'search=/42,43.685,22.234,24.251_coords/1,25_page/';

		return this.restClient.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.REGISTER);
	}

}
