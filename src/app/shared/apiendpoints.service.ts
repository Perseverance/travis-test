import { Injectable } from '@angular/core';

@Injectable()
export class APIEndpointsService {

	private INTERNAL_API_PREFIX = 'api';

	public EXTERNAL_ENDPOINTS = {};

	public INTERNAL_ENDPOINTS = {
		REGISTER: `${this.INTERNAL_API_PREFIX}/Users/register`,
		PROPERTIES_BY_RECTANGLE: `${this.INTERNAL_API_PREFIX}properties/rect?`
	};

	constructor() { }

}
