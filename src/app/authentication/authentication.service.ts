import { OAuth2TokenTypes } from './oauth2-token-types';
import { OAuth2GrantTypes } from './oauth2-grant-types';
import { APIEndpointsService } from './../shared/apiendpoints.service';
import { RestClientService, APIResponseWithStatus } from './../shared/rest-client.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthenticationService {

	constructor(public restClient: RestClientService, public apiEndpoints: APIEndpointsService) {
	}

	public get hasUserLoggedIn(): boolean {
		return this.restClient.hasUserLoggedIn;
	}

	public async performSignUp(email: string, password: string, firstName: string, lastName: string): Promise<APIResponseWithStatus> {
		const data = {
			email,
			password,
			firstName,
			lastName
		};
		const result = await this.restClient.post(this.apiEndpoints.INTERNAL_ENDPOINTS.REGISTER, data);
		return { message: result.data.message };
	}

	public async performLogin(email: string, password: string, rememberMe = false): Promise<boolean> {
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

		return true;
	}

	public performAnonymousLogin(): Promise<boolean> {
		const doNotRememberUser = false;
		return this.performLogin('', '', doNotRememberUser);
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
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
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

	private setOAuthTokensInRestService(tokenType: string, accessToken: string, refreshToken: string, expiresIn: number, rememberMe: boolean) {
		if (tokenType !== OAuth2TokenTypes.BEARER) {
			throw new Error('Wrong type of return token');
		}
		if (rememberMe) {
			this.restClient.shouldRememberUser = RestClientService.REMEMBER_USER;
		} else {
			this.restClient.shouldRememberUser = RestClientService.DO_NOT_REMEMBER_USER;
		}
		this.restClient.accessToken = accessToken;
		this.restClient.refreshToken = refreshToken;
		this.restClient.tokenExpiresIn = expiresIn;
	}

}
