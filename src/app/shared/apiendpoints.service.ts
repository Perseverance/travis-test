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
		REQUEST_PROPERTY_INFO: `${this.INTERNAL_API_PREFIX}/Agents/requestInfo`,
		AGENCY_CREATE: `${this.INTERNAL_API_PREFIX}/Agencies/create`,
		AGENCY_SUGGESTIONS: `${this.INTERNAL_API_PREFIX}/Agencies/find`,
		EXTERNAL_LOGIN: `${this.INTERNAL_API_PREFIX}/Users/extLogin`,
		EMAIL_AVAILABLE: `${this.INTERNAL_API_PREFIX}/Users/userexists`,
		GET_USER: `${this.INTERNAL_API_PREFIX}/Users/single`,
		UPDATE_USER: `${this.INTERNAL_API_PREFIX}/Users/update`,
		REFERRAL: `${this.INTERNAL_API_PREFIX}/Users/referral`,
		SINGLE_PROPERTY: `${this.INTERNAL_API_PREFIX}/Properties/single`,
		CREATE_PROPERTY: `${this.INTERNAL_API_PREFIX}/Properties/create`,
		UPLOAD_IMAGES: `${this.INTERNAL_API_PREFIX}/Properties/uploadImages`,
		PROPERTIES_BY_RECTANGLE: `${this.INTERNAL_API_PREFIX}/Properties/rect`,
		FAVOURITE_LOCATIONS: `${this.INTERNAL_API_PREFIX}/Properties/favouritelocations`,
		NEW_PROPERTIES: `${this.INTERNAL_API_PREFIX}/Properties/newproperties`
	};

	constructor() {
	}

}
