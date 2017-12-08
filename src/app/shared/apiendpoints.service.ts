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
		CHANGE_PASSWORD: `${this.INTERNAL_API_PREFIX}/Users/changepassword`,
		FORGOT_PASSWORD: `${this.INTERNAL_API_PREFIX}/Users/forgotpassword`,
		REFERRAL: `${this.INTERNAL_API_PREFIX}/Users/referral`,
		USER_TRANSACTION_HISTORY: `${this.INTERNAL_API_PREFIX}/users/transactions`,
		USER_UPDATE_WALLET: `${this.INTERNAL_API_PREFIX}/users/updatewallet`,
		CONVERT_STASHED_TOKENS: `${this.INTERNAL_API_PREFIX}/users/convertstashedtokens`,
		IS_PROPERTY_OWNER: `${this.INTERNAL_API_PREFIX}/Properties/isCurrentUserOwner`,
		SINGLE_PROPERTY: `${this.INTERNAL_API_PREFIX}/Properties/single`,
		CREATE_PROPERTY: `${this.INTERNAL_API_PREFIX}/Properties/create`,
		UPDATE_PROPERTY: `${this.INTERNAL_API_PREFIX}/Properties/update`,
		UPLOAD_IMAGES: `${this.INTERNAL_API_PREFIX}/Properties/uploadImages`,
		PROPERTIES_BY_RECTANGLE: `${this.INTERNAL_API_PREFIX}/Properties/rect`,
		FAVOURITE_LOCATIONS: `${this.INTERNAL_API_PREFIX}/Properties/favouritelocations`,
		NEW_PROPERTIES: `${this.INTERNAL_API_PREFIX}/Properties/newproperties`,
		MY_LISTINGS: `${this.INTERNAL_API_PREFIX}/Properties/mylistings`,
		MARK_PROPERTY_AS_SOLD: `${this.INTERNAL_API_PREFIX}/Properties/setsold/`,
		HIDE_PROPERTY: `${this.INTERNAL_API_PREFIX}/Properties/hidden`,
		RESERVE_PROPERTY: `${this.INTERNAL_API_PREFIX}/payments/createChargeForReservation`,
		PUSHER_AUTH_ENDPOINT: `${this.INTERNAL_API_PREFIX}/notifications/authPusher`,
		DEAL_PARTIES: `${this.INTERNAL_API_PREFIX}/deeds/dealparties`,
		CREATE_DEED: `${this.INTERNAL_API_PREFIX}/deeds/createDeed`,
		UPLOAD_DEED_DOCUMENT: `${this.INTERNAL_API_PREFIX}/Deeds/uploaddocument`,
		GET_DOWNLOAD_DOCUMENT_LINK: `${this.INTERNAL_API_PREFIX}/Deeds/documentdownloadurl`,
		GET_SIGN_URL: `${this.INTERNAL_API_PREFIX}/Deeds/documentsignurl`,
		DEED_ADD_SELLER: `${this.INTERNAL_API_PREFIX}/Deeds/addseller`,
		DEED_ADD_ESCROW: `${this.INTERNAL_API_PREFIX}/Deeds/addescrow`,
		PROPERTY_PREVIEW: `${this.INTERNAL_API_PREFIX}/Deeds/property`
	};

	constructor() {
	}

}
