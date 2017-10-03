import { SessionStorageService } from './session-storage.service';
import { LocalStorageService } from './localStorage.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable()
export class RestClientService {

	public static REMEMBER_USER = 1;
	public static DO_NOT_REMEMBER_USER = 2;
	public static UNINITIALIZED = 0;

	private _rememberUser = 0;

	private _refreshToken: string;
	private _accessToken: string;

	private _tokenExpireTimestamp: number;
	private _restUrl: string;


	constructor(private propyLocalStorage: LocalStorageService, private propySessionStorage: SessionStorageService) {
		this._restUrl = environment.apiUrl;

		if (this.isTokenSavedInLocalStorage) {
			this.setupTokenFieldsFromLocalStorage();
			return;
		}

		this.setupTokenFieldsFromSession();
	}

	private get isTokenSavedInLocalStorage(): boolean {
		return this.propyLocalStorage.accessToken !== null;
	}

	private setupTokenFieldsFromSession() {
		this._accessToken = this.propySessionStorage.accessToken;
		this._refreshToken = this.propySessionStorage.refreshToken;
		this._tokenExpireTimestamp = this.propySessionStorage.tokenExpireTimestamp;
	}

	private setupTokenFieldsFromLocalStorage() {
		this._accessToken = this.propyLocalStorage.accessToken;
		this._refreshToken = this.propyLocalStorage.refreshToken;
		this._tokenExpireTimestamp = this.propyLocalStorage.tokenExpireTimestamp;
	}

	private get bearerHeaderString(): string {
		if (this._accessToken === undefined) {
			throw new Error('Trying to work without access token');
		}
		return `Bearer ${this._accessToken}`;
	}

	private get bearerHeaderObject(): object {
		return {
			'Authorization': this.bearerHeaderString
		};
	}

	public get hasUserLoggedIn(): boolean {
		return this._refreshToken !== undefined && this._refreshToken !== null && this._refreshToken !== '';
	}

	public set shouldRememberUser(rememberState: number) {
		if (rememberState < 1 || rememberState > 2) {
			throw new Error('Invalid state');
		}
		this._rememberUser = rememberState;
	}

	public get isTokenExpired(): boolean {
		const now: Date = new Date();
		return now.getTime() > this._tokenExpireTimestamp;
	}

	public set tokenExpiresIn(expiersInSeconds: number) {
		const expiry: Date = new Date();
		expiry.setSeconds(expiry.getSeconds() + expiersInSeconds);
		this._tokenExpireTimestamp = expiry.getTime();
		if (this._rememberUser === RestClientService.REMEMBER_USER) {
			this.propyLocalStorage.tokenExpireTimestamp = this._tokenExpireTimestamp;
			return;
		}
		if (this._rememberUser === RestClientService.DO_NOT_REMEMBER_USER) {
			this.propySessionStorage.tokenExpireTimestamp = this._tokenExpireTimestamp;
			return;
		}

		throw new Error('shouldRememberUser not set or set to incorrect state');
	}

	public get accessToken(): string {
		return this._accessToken;
	}

	public set accessToken(token: string) {
		this._accessToken = token;
		if (this._rememberUser === RestClientService.REMEMBER_USER) {
			this.propyLocalStorage.accessToken = token;
			return;
		}
		if (this._rememberUser === RestClientService.DO_NOT_REMEMBER_USER) {
			this.propySessionStorage.accessToken = token;
			return;
		}

		throw new Error('shouldRememberUser not set or set to incorrect state');
	}

	public get refreshToken(): string {
		return this._refreshToken;
	}

	public set refreshToken(token: string) {
		this._refreshToken = token;
		if (this._rememberUser === RestClientService.REMEMBER_USER) {
			this.propyLocalStorage.refreshToken = token;
			return;
		}
		if (this._rememberUser === RestClientService.DO_NOT_REMEMBER_USER) {
			this.propySessionStorage.refreshToken = token;
			return;
		}

		throw new Error('shouldRememberUser not set or set to incorrect state');
	}

	private forgeUrl(endpoint: string): string {
		return `${this._restUrl}${endpoint}`;
	}

	/**
	 * get makes a get request without token
	 */
	public get(endpoint: string, config: object = {}) {
		const url = this.forgeUrl(endpoint);
		return axios.get(url, config);
	}

	/**
	 * post - makes a post request without token
	 */
	public post(endpoint: string, data: object, config: object = {}) {
		const url = this.forgeUrl(endpoint);
		return axios.post(url, data, config);
	}

	/**
	 * put - makes a put requiest without token
	 */
	public put(endpoint: string, data: object, config: object = {}) {
		const url = this.forgeUrl(endpoint);
		return axios.put(url, data, config);
	}

	/**
	 * patch - makes a patch requiest without token
	 */
	public patch(endpoint: string, data: object, config: object = {}) {
		const url = this.forgeUrl(endpoint);
		return axios.patch(url, data, config);
	}

	/**
	 * delete makes a delete request without token
	 */
	public delete(endpoint: string, config: object = {}) {
		const url = this.forgeUrl(endpoint);
		return axios.delete(url, config);
	}

	/**
	 * getWithAccessToken - makes a get request and adds the stored access token
	 */
	public getWithAccessToken(endpoint: string, config: object = {}) {
		const configWithToken = {
			headers: {
				...this.bearerHeaderObject
			},
			...config
		};

		return this.get(endpoint, configWithToken);
	}

	/**
	 * postWithAccessToken - makes a post equest and adds the stored access token;
	 */
	public postWithAccessToken(endpoint: string, data: object, config: object = {}) {
		const configWithToken = {
			headers: {
				...this.bearerHeaderObject
			},
			...config
		};

		return this.post(endpoint, data, configWithToken);
	}

	/**
	 * putWithAccessToken - makes a put equest and adds the stored access token;
	 */
	public putWithAccessToken(endpoint: string, data: object, config: object = {}) {
		const configWithToken = {
			headers: {
				...this.bearerHeaderObject
			},
			...config
		};

		return this.put(endpoint, data, configWithToken);
	}

	/**
	 * patchWithAccessToken - makes a patch equest and adds the stored access token;
	 */
	public patchWithAccessToken(endpoint: string, data: object, config: object = {}) {
		const configWithToken = {
			headers: {
				...this.bearerHeaderObject
			},
			...config
		};

		return this.patch(endpoint, data, configWithToken);
	}

	/**
	 * deleteWithAccessToken - makes a delete request and adds the stored access token
	 */
	public deleteWithAccessToken(endpoint: string, config: object = {}) {
		const configWithToken = {
			headers: {
				...this.bearerHeaderObject
			},
			...config
		};

		return this.delete(endpoint, configWithToken);
	}


}

export interface APIResponseWithStatus {
	message: string;
}
