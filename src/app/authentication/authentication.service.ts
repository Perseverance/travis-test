import { Subscription } from 'rxjs/Subscription';
import { NextObserver } from 'rxjs/Observer';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { environment } from './../../environments/environment';
import { OAuth2TokenTypes } from './oauth2-token-types';
import { OAuth2GrantTypes } from './oauth2-grant-types';
import { APIEndpointsService } from './../shared/apiendpoints.service';
import { RestClientService } from './../shared/rest-client.service';
import { Injectable } from '@angular/core';
import { FacebookService, InitParams, LoginResponse, LoginOptions } from 'ngx-facebook';
import { LinkedInService } from 'angular-linkedin-sdk';
import { BrowserDetectionService } from '../shared/browser-detection.service';

export class AnonymousUserCredentials {
	public static firstName = 'Anonymous';
	public static lastName = 'Anonymous';
}

export enum ExternalAuthenticationProviders {
	FACEBOOK = 'facebook',
	LINKEDIN = 'linkedin'
}

export interface ExternalLoginRequest {
	loginProvider: string;
	providerKey: string;
	accessToken: string;
}

export interface RegisterAgentRequest {
	firstName: string;
	lastName: string;
	email: string;
	agencyId: string;
	agencyName: string;
	locations: string[];
	info: string;
}

export interface LinkedInAuthParams {
	userId: string;
	accessToken: string;
}

export interface UserData {
	isAnonymous: boolean;
	user: any | null;
}

@Injectable()
export class AuthenticationService {

	private userDataSubject: ReplaySubject<UserData>;

	constructor(public restClient: RestClientService,
		public apiEndpoints: APIEndpointsService,
		private fbService: FacebookService,
		private linkedinService: LinkedInService,
		private browserDetectionService: BrowserDetectionService) {

		const initParams: InitParams = {
			appId: environment.fbConfigParams.appId,
			xfbml: environment.fbConfigParams.xfbml,
			version: environment.fbConfigParams.version
		};

		fbService.init(initParams);

		this.userDataSubject = new ReplaySubject(1);

		if (!this.hasAuthCredentials) {
			this.pushUserData({ isAnonymous: true, user: null });
			return;
		}
		if (!this.restClient.isTokenExpired) {
			this.getCurrentUser(true, true);
		}
	}

	private _user: any;

	public set user(inUser: any) {
		this._user = inUser;
	}

	public get user(): any {
		return this._user;
	}

	public get isUserAnonymous(): boolean {
		if (!this.hasUserLoaded) {
			return true;
		}
		const anonymousFirstName = (this._user.firstName === AnonymousUserCredentials.firstName);
		const anonymousLastName = (this._user.lastName === AnonymousUserCredentials.lastName);
		return (anonymousFirstName && anonymousLastName);
	}

	public hasUserLoaded(): boolean {
		if (this._user === undefined) {
			return false;
		}
		if (this._user === null) {
			return false;
		}
		return true;
	}

	public get hasUserLoggedIn(): boolean {
		return this.restClient.hasUserLoggedIn;
	}

	public get hasAuthCredentials(): boolean {
		return this.restClient.accessToken != null;
	}

	public subscribeToUserDataOnce(observer: NextObserver<UserData>): Subscription {
		return this.userDataSubject.first().subscribe(observer);
	}

	public subscribeToUserData(observer: NextObserver<UserData>): Subscription {
		return this.userDataSubject.subscribe(observer);
	}

	private pushUserData(data: UserData) {
		this.userDataSubject.next(data);
	}

	public performLogout(): Promise<boolean> {
		this.restClient.removeSavedTokens();
		return this.performAnonymousLogin();
	}

	public async performSignUp(email: string,
		password: string,
		firstName: string,
		lastName: string,
		phoneNumber: string,
		rememberMe = false, fetchUser = true): Promise<boolean> {
		const data = {
			email,
			password,
			firstName,
			lastName,
			phoneNumber
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.REGISTER, data);
		if (fetchUser) {
			this.getCurrentUser();
		}
		if (rememberMe) {
			return this.refreshStoredAccessToken(true);
		}
		return true;
	}

	public async performLogin(email: string, password: string, rememberMe = false, fetchUser = true): Promise<boolean> {
		const config = {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		};
		let result;
		let data;
		if (this.browserDetectionService.isIE) {
			data = OAuth2GrantTypes.getGrantTypePasswordDataObject(email, password);
			result = await this.restClient.postWithSerialization(this.apiEndpoints.EXTERNAL_ENDPOINTS.GET_TOKEN, data, config);
		} else {
			data = OAuth2GrantTypes.getGrantTypePasswordDataURLParams(email, password);
			result = await this.restClient.post(this.apiEndpoints.EXTERNAL_ENDPOINTS.GET_TOKEN, data, config);
		}

		this.setOAuthTokensInRestService(
			result.data.token_type,
			result.data.access_token,
			result.data.refresh_token,
			result.data.expires_in,
			rememberMe);

		if (fetchUser) {
			this.getCurrentUser(true, true);
		}

		return true;
	}

	public async performAnonymousLogin(): Promise<boolean> {
		const doNotRememberUser = false;
		const result = this.performLogin('', '', doNotRememberUser);
		this.pushUserData({ isAnonymous: true, user: null });
		return result;
	}

	public async performFacebookLogin(fetchUser = true): Promise<any> {

		const options: LoginOptions = {
			scope: 'public_profile,email'
		};

		const result: LoginResponse = await this.fbService.login();

		const loginResult = await this.externalLogin(
			ExternalAuthenticationProviders.FACEBOOK,
			result.authResponse.userID,
			result.authResponse.accessToken);


		if (!loginResult.isFirstLogin) {
			if (fetchUser) {
				this.getCurrentUser();
			}
			// TODO this is to be refactored soon in the API and here
			if (!(await this.performLogin('facebook', result.authResponse.userID, true))) {
				throw new Error('Could not login');
			}
			return loginResult;
		}
		if (fetchUser) {
			this.getCurrentUser();
		}

		await this.refreshStoredAccessToken(true);
		return loginResult;
	}

	/**
	 * @notice External login just upgrades the anonymous user to not anonymous one
	 * @param externalLoginService - Facebook or Linkedin
	 * @param userId - the userid in the appropriate login service
	 * @param accessToken - the oauth access token of the corresponding login service
	 */
	private async externalLogin(externalLoginService: ExternalAuthenticationProviders,
		userId: string,
		accessToken: string): Promise<any> {
		const data: ExternalLoginRequest = {
			loginProvider: externalLoginService,
			providerKey: userId,
			accessToken
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.EXTERNAL_LOGIN, data);

		return result.data.data;
	}

	/**
	 * @param forceRefresh forces refresh even if the token has not expired yet
	 * @returns the return data on success or null if refresh was not needed
	 */
	public async refreshStoredAccessToken(forceRefresh = false, fetchUser = true): Promise<boolean> {
		if (!this.hasUserLoggedIn) {
			throw new Error('Incorrect state: trying to refresh without user ever logged in');
		}
		if (!this.restClient.isTokenExpired && !forceRefresh) {
			return true;
		}

		const config = {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		};

		let data;
		if (this.browserDetectionService.isIE) {
			data = OAuth2GrantTypes.getGrantTypeRefreshTokenDataObject(this.restClient.refreshToken);
		} else {
			data = OAuth2GrantTypes.getGrantTypeRefreshTokenDataURLParams(this.restClient.refreshToken);
		}

		try {
			let result;
			if (this.browserDetectionService.isIE) {
				result = await this.restClient.postWithSerialization(this.apiEndpoints.EXTERNAL_ENDPOINTS.REFRESH_TOKEN, data, config);
			} else {
				result = await this.restClient.post(this.apiEndpoints.EXTERNAL_ENDPOINTS.REFRESH_TOKEN, data, config);
			}

			const rememberUser = true;
			// Neither anonymous nor not-remembered users would need to come here as they would be going through the auth flow

			this.setOAuthTokensInRestService(
				result.data.token_type,
				result.data.access_token,
				result.data.refresh_token,
				result.data.expires_in,
				rememberUser);

			if (fetchUser) {
				await this.getCurrentUser(true);
			}

			return true;
		} catch (error) {
			console.error('Problem with refresh, probably the tokens');
		}

		return this.performLogout();
	}

	public async refreshTokenOrLoginAnonym(): Promise<boolean> {
		if (this.hasUserLoggedIn) {
			return this.refreshStoredAccessToken();
		} else {
			return this.performAnonymousLogin();
		}
	}

	private rememberUserCredentials(rememberMe: boolean) {
		if (rememberMe) {
			this.restClient.shouldRememberUser = RestClientService.REMEMBER_USER;
		} else {
			this.restClient.shouldRememberUser = RestClientService.DO_NOT_REMEMBER_USER;
		}
	}

	private setOAuthTokensInRestService(tokenType: string, accessToken: string, refreshToken: string, expiresIn: number, rememberMe: boolean) {
		if (tokenType !== OAuth2TokenTypes.BEARER) {
			throw new Error('Wrong type of return token');
		}
		this.rememberUserCredentials(rememberMe);
		this.restClient.accessToken = accessToken;
		this.restClient.refreshToken = refreshToken;
		this.restClient.tokenExpiresIn = expiresIn;
	}

	public async performAgentSignup(data: RegisterAgentRequest): Promise<boolean> {
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.REGISTER_AGENT, data);
		return true;
	}

	public async getCurrentUser(saveUser = true, getNotifications?: any): Promise<any> {
		const result = await this.getUser('', getNotifications);
		if (saveUser) {
			this.user = result.data.data;
			this.pushUserData({ isAnonymous: this.isUserAnonymous, user: this.user });
		}
		return result;
	}

	public async getUser(id: string, getNotifications?: any): Promise<any> {
		const params = {
			id,
			getNotifications

		};
		const result = await this.restClient.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.GET_USER, { params });
		return result;
	}

	public async assignRefferer(email: string, referrer: string): Promise<boolean> {
		const params = {
			email,
			referrer
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.REFERRAL, params);

		return result.data.data.value;
	}

	public async updateUser(email: string, firstName: string, lastName: string, phoneNumber: string, saveUser = true): Promise<any> {
		const params = {
			email,
			firstName,
			lastName,
			phoneNumber,
			isBasicInfoUpdate: true // required by the API
		};
		const result = await this.restClient.putWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.UPDATE_USER, params);
		if (saveUser) {
			this.user = result.data.data;
			this.pushUserData({ isAnonymous: this.isUserAnonymous, user: this.user });
		}
		return result.data.data;
	}

	public async changePassword(oldPassword: string, password): Promise<any> {
		const params = {
			oldPassword,
			password,
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.CHANGE_PASSWORD, params);
		if (!result.data.data) {
			throw new Error('new-password-fail');
		}
		return result.data.data;
	}

	public async forgotPassword(email: string): Promise<any> {
		const params = {
			email
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.FORGOT_PASSWORD, {}, { params });
	}

	public async updateVerificationEmail(email: string): Promise<any> {
		const params = {
			email
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.UPDATE_EMAIL, params);
	}

}
