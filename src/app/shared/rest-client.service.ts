import { LocalStorageService } from './localStorage.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable()
export class RestClientService {

	private _refreshToken: string;
	private _accessToken: string;

	private _tokenExpireTimestamp: number;
	private _restUrl: string;


	constructor(private propyStorage: LocalStorageService) {
		this._restUrl = environment.apiUrl;

		this._accessToken = propyStorage.accessToken;
		this._refreshToken = propyStorage.refreshToken;
		this._tokenExpireTimestamp = propyStorage.tokenExpireTimestamp;
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

	public get isTokenExpired(): boolean {
		const now: Date = new Date();
		return now.getTime() > this._tokenExpireTimestamp;
	}

	public set tokenExpiresIn(expiersInSeconds: number) {
		const expiry: Date = new Date();
		expiry.setSeconds(expiry.getSeconds() + expiersInSeconds);
		this._tokenExpireTimestamp = expiry.getTime();
	}

	public set accessToken(token: string) {
		this._accessToken = token;
		this.propyStorage.accessToken = token;
	}

	public set refreshToken(token: string) {
		this._refreshToken = token;
		this.propyStorage.refreshToken = token;
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
