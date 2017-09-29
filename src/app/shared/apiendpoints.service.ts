import {Injectable} from '@angular/core';

@Injectable()
export class APIEndpointsService {

	private INTERNAL_API_PREFIX = 'api';

	public EXTERNAL_ENDPOINTS = {
		GET_TOKEN: 'token',
		REFRESH_TOKEN: 'token'
	};

	public INTERNAL_ENDPOINTS = {
		REGISTER: `${this.INTERNAL_API_PREFIX}/Users/register`,
		EMAIL_AVAILABLE: `${this.INTERNAL_API_PREFIX}/Users/userexists`,
		PROPERTIES_BY_RECTANGLE: `${this.INTERNAL_API_PREFIX}/properties/rect`
	};

	constructor() {
	}

}
