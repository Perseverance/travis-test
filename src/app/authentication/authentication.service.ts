import {environment} from './../../environments/environment';
import {OAuth2TokenTypes} from './oauth2-token-types';
import {OAuth2GrantTypes} from './oauth2-grant-types';
import {APIEndpointsService} from './../shared/apiendpoints.service';
import {RestClientService, APIResponseWithStatus} from './../shared/rest-client.service';
import {Injectable} from '@angular/core';
import {FacebookService, InitParams, LoginResponse, LoginOptions} from 'ngx-facebook';
import {LinkedInService} from 'angular-linkedin-sdk';

export enum ExternalAuthenticationProviders {
	FACEBOOK = 'facebook',
	LINKEDIN = 'linkedin'
}

export interface ExternalLoginRequest {
	loginProvider: string;
	providerKey: string;
	accessToken: string;
}

export interface LinkedInAuthParams {
	userId: string;
	accessToken: string;
}

@Injectable()
export class AuthenticationService {

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
	}

	public get hasUserLoggedIn(): boolean {
		return this.restClient.hasUserLoggedIn;
	}

	public get hasAuthCredentials(): boolean {
		return this.restClient.accessToken != null;
	}

	public async performSignUp(email: string, password: string, firstName: string, lastName: string): Promise<APIResponseWithStatus> {
		const data = {
			email,
			password,
			firstName,
			lastName
		};
		const result = await this.restClient.post(this.apiEndpoints.INTERNAL_ENDPOINTS.REGISTER, data);
		return {message: result.data.message};
	}

	public async performLogin(email: string, password: string, rememberMe = false): Promise<boolean> {
		const data = OAuth2GrantTypes.getGrantTypePasswordDataURLParams(email, password);
		const config = {
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		};

		const result = await this.restClient.post(this.apiEndpoints.EXTERNAL_ENDPOINTS.GET_TOKEN, data, config);

		this.setOAuthTokensInRestService(
			result.data.token_type,
			result.data.access_token,
			result.data.refresh_token,
			result.data.expires_in,
			rememberMe);

		return true;
	}

	public async performAnonymousLogin(): Promise<boolean> {
		const doNotRememberUser = false;
		return this.performLogin('', '', doNotRememberUser);
	}

	public async performFacebookLogin(): Promise<boolean> {

		const options: LoginOptions = {
			scope: 'public_profile,email'
		};

		const result: LoginResponse = await this.fbService.login();

		await this.externalLogin(ExternalAuthenticationProviders.FACEBOOK, result.authResponse.userID, result.authResponse.accessToken);

		return this.refreshStoredAccessToken(true);
	}

	public async performLinkedInLogin(): Promise<boolean> {

		await this.waitForLinkedInToInitialize();

		const linkedInAuthParams = await this.signInAtLinkedIn();

		await this.externalLogin(ExternalAuthenticationProviders.LINKEDIN, linkedInAuthParams.userId, linkedInAuthParams.accessToken);

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

		return true;
	}

	/**
	 * @param forceRefresh forces refresh even if the token has not expired yet
	 * @returns the return data on success or null if refresh was not needed
	 */
	public async refreshStoredAccessToken(forceRefresh = false): Promise<boolean> {
		if (!this.hasUserLoggedIn) {
			throw new Error('Incorrect state: trying to refresh without user ever logged in');
		}
		if (!this.restClient.isTokenExpired && !forceRefresh) {
			return null;
		}

		const data = OAuth2GrantTypes.getGrantTypeRefreshTokenDataURLParams(this.restClient.refreshToken);
		const config = {
			headers: {'Content-Type': 'application/x-www-form-urlencoded'},
		};

		const result = await this.restClient.post(this.apiEndpoints.EXTERNAL_ENDPOINTS.REFRESH_TOKEN, data, config);

		const rememberUser = true;
		// Neither anonymous nor not-remembered users would need to come here as they would be going through the auth flow

		this.setOAuthTokensInRestService(
			result.data.token_type,
			result.data.access_token,
			result.data.refresh_token,
			result.data.expires_in,
			rememberUser);

		return true;
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
}
