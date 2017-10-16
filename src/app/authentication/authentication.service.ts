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
	phoneNumber: string;
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
		private linkedinService: LinkedInService) {

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
			this.getCurrentUser(true);
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

	public subscribeToUserData(observer: NextObserver<UserData>) {
		this.userDataSubject.subscribe(observer);
	}

	private pushUserData(data: UserData) {
		this.userDataSubject.next(data);
	}

	public async performLogout(): Promise<boolean> {
		this.restClient.removeSavedTokens();
		return this.performAnonymousLogin();
	}

	public async performSignUp(email: string,
		password: string,
		firstName: string,
		lastName: string,
		rememberMe = false, fetchUser = true): Promise<boolean> {
		const data = {
			email,
			password,
			firstName,
			lastName
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
		const data = OAuth2GrantTypes.getGrantTypePasswordDataURLParams(email, password);
		const config = {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		};

		const result = await this.restClient.post(this.apiEndpoints.EXTERNAL_ENDPOINTS.GET_TOKEN, data, config);

		this.setOAuthTokensInRestService(
			result.data.token_type,
			result.data.access_token,
			result.data.refresh_token,
			result.data.expires_in,
			rememberMe);

		if (fetchUser) {
			this.getCurrentUser();
		}

		return true;
	}

	public async performAnonymousLogin(): Promise<boolean> {
		const doNotRememberUser = false;
		const result = this.performLogin('', '', doNotRememberUser);
		this.pushUserData({ isAnonymous: true, user: null });
		return result;
	}

	public async performFacebookLogin(fetchUser = true): Promise<boolean> {

		const options: LoginOptions = {
			scope: 'public_profile,email'
		};

		const result: LoginResponse = await this.fbService.login();

		const isFirstLogin = await this.externalLogin(
			ExternalAuthenticationProviders.FACEBOOK,
			result.authResponse.userID,
			result.authResponse.accessToken);

		if (!isFirstLogin) {
			if (fetchUser) {
				this.getCurrentUser();
			}
			// TODO this is to be refactored soon in the API and here
			return this.performLogin('facebook', result.authResponse.userID, true);
		}
		if (fetchUser) {
			this.getCurrentUser();
		}
		return this.refreshStoredAccessToken(true);
	}

	public async performLinkedInLogin(fetchUser = true): Promise<boolean> {

		await this.waitForLinkedInToInitialize();

		const linkedInAuthParams = await this.signInAtLinkedIn();

		const isFirstLogin = await this.externalLogin(
			ExternalAuthenticationProviders.LINKEDIN,
			linkedInAuthParams.userId,
			linkedInAuthParams.accessToken);

		if (!isFirstLogin) {
			if (fetchUser) {
				this.getCurrentUser();
			}
			// TODO this is to be refactored soon in the API and here
			return this.performLogin('linkedin', linkedInAuthParams.userId, true);
		}
		if (fetchUser) {
			this.getCurrentUser();
		}
		return this.refreshStoredAccessToken(true);
	}

	private waitForLinkedInToInitialize() {
		return new Promise<boolean>((resolve, reject) => {
			this.linkedinService.isInitialized$.subscribe({
				complete: () => {
					resolve();
				}
			});
		});
	}

	private async signInAtLinkedIn(): Promise<LinkedInAuthParams> {
		return new Promise<LinkedInAuthParams>(async (resolve, reject) => {
			this.linkedinService.login()
				.subscribe({
					complete: async () => {
						const linkedInParams = this.getLinkedInAuthParams();
						resolve(linkedInParams);
					}
				});
		});
	}

	private getLinkedInAuthParams(): LinkedInAuthParams {
		const linkedInMainObject = this.linkedinService.getSdkIN();
		if (!linkedInMainObject) {
			throw new Error('Could not get params from linked in. Please try again');
		}
		const linkedInAuthObject = linkedInMainObject.ENV.auth;
		return {
			userId: linkedInAuthObject.member_id,
			accessToken: linkedInAuthObject.oauth_token
		};

	}


	/**
	 * @notice External login just upgrades the anonymous user to not anonymous one
	 * @param externalLoginService - Facebook or Linkedin
	 * @param userId - the userid in the appropriate login service
	 * @param accessToken - the oauth access token of the corresponding login service
	 */
	private async externalLogin(externalLoginService: ExternalAuthenticationProviders,
		userId: string,
		accessToken: string): Promise<boolean> {
		const data: ExternalLoginRequest = {
			loginProvider: externalLoginService,
			providerKey: userId,
			accessToken
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.EXTERNAL_LOGIN, data);

		return result.data.data.value;
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

		const data = OAuth2GrantTypes.getGrantTypeRefreshTokenDataURLParams(this.restClient.refreshToken);
		const config = {
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
		};

		try {
			const result = await this.restClient.post(this.apiEndpoints.EXTERNAL_ENDPOINTS.REFRESH_TOKEN, data, config);

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

	public async getCurrentUser(saveUser = true): Promise<any> {
		const result = await this.getUser('');
		if (saveUser) {
			this.user = result.data.data;
			this.pushUserData({ isAnonymous: this.isUserAnonymous, user: this.user });
		}
		return result;
	}

	public async getUser(id: string): Promise<any> {
		const params = {
			id
		};
		const result = await this.restClient.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.GET_USER, { params });
		return result;
	}

}
