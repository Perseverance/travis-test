import { Injectable } from '@angular/core';

@Injectable()
export class APIEndpointsService {

	private INTERNAL_API_PREFIX = '/api';

	public EXTERNAL_ENDPOINTS = {
		GET_TOKEN: '/token',
		REFRESH_TOKEN: '/token'
	};

	public INTERNAL_ENDPOINTS = {
		REGISTER: `${this.INTERNAL_API_PREFIX}/Users/register`,
		REGISTER_AGENT: `${this.INTERNAL_API_PREFIX}/Agents/register`,
		AGENCY_SUGGESTIONS: `${this.INTERNAL_API_PREFIX}/Agencies/find`,
		EXTERNAL_LOGIN: `${this.INTERNAL_API_PREFIX}/Users/extLogin`,
		EMAIL_AVAILABLE: `${this.INTERNAL_API_PREFIX}/Users/userexists`,
		GET_USER: `${this.INTERNAL_API_PREFIX}/Users/single`,
		SINGLE_PROPERTY: `${this.INTERNAL_API_PREFIX}/Properties/single`,
		PROPERTIES_BY_RECTANGLE: `${this.INTERNAL_API_PREFIX}/Properties/rect`,
		FAVOURITE_LOCATIONS: `${this.INTERNAL_API_PREFIX}/Properties/favouritelocations`
	};

	constructor() {
	}

}
