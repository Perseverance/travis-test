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
		SET_WALLET: `${this.INTERNAL_API_PREFIX}/users/setwallet`,
		CONVERT_STASHED_TOKENS: `${this.INTERNAL_API_PREFIX}/users/convertstashedtokens`,
		SOCIAL_MEDIA_SHARE: `${this.INTERNAL_API_PREFIX}/Users/socialmediashare`,
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
		MARK_PROPERTY_AS_UNLISTED: `${this.INTERNAL_API_PREFIX}/Properties/unlist/`,
		HIDE_PROPERTY: `${this.INTERNAL_API_PREFIX}/Properties/hidden`,
		RESERVE_PROPERTY: `${this.INTERNAL_API_PREFIX}/payments/createChargeForReservation`,
		CONFIRM_RESERVE_PROPERTY: `${this.INTERNAL_API_PREFIX}/payments/confirmReserveProperty`,
		PUSHER_AUTH_ENDPOINT: `${this.INTERNAL_API_PREFIX}/notifications/authPusher`,
		DEAL_PARTIES: `${this.INTERNAL_API_PREFIX}/deeds/dealparties`,
		CREATE_DEED: `${this.INTERNAL_API_PREFIX}/deeds/createDeed`,
		GET_DEED: `${this.INTERNAL_API_PREFIX}/deeds/single`,
		MY_DEEDS: `${this.INTERNAL_API_PREFIX}/deeds/mydeeds`,
		UPLOAD_DEED_DOCUMENT: `${this.INTERNAL_API_PREFIX}/Deeds/uploaddocument`,
		GET_DOWNLOAD_DOCUMENT_LINK: `${this.INTERNAL_API_PREFIX}/Deeds/documentdownloadurl`,
		GET_SIGN_URL: `${this.INTERNAL_API_PREFIX}/Deeds/documentsignurl`,
		SIGN_DOCUMENT: `${this.INTERNAL_API_PREFIX}/Deeds/signdocument`,
		SAVE_DOCUMENT_HASH: `${this.INTERNAL_API_PREFIX}/Deeds/savedocumenttxhash`,
		INVITE_PARTY: `${this.INTERNAL_API_PREFIX}/Deeds/inviteparty`,
		ACCEPT_PARTY: `${this.INTERNAL_API_PREFIX}/Deeds/acceptparty`,
		REJECT_PARTY: `${this.INTERNAL_API_PREFIX}/Deeds/rejectparty`,
		CANCEL_INVITE: `${this.INTERNAL_API_PREFIX}/Deeds/canceldeed`,
		PROPERTY_PREVIEW: `${this.INTERNAL_API_PREFIX}/Deeds/property`,
		GET_DOCUMENT_CONTENT: `${this.INTERNAL_API_PREFIX}/Deeds/documentcontent`,
		AGREE_DOCUMENT: `${this.INTERNAL_API_PREFIX}/Deeds/signdocument`,
		VERIFY_ACCOUNT: `${this.INTERNAL_API_PREFIX}/Users/verifyemail`,
		RESEND_VERIFY_ACCOUNT: `${this.INTERNAL_API_PREFIX}/Users/resendemailverification`,
		FEATURED_PROPERTIES: `${this.INTERNAL_API_PREFIX}/Properties/featuredproperties`
	};

	constructor() {
	}

}
