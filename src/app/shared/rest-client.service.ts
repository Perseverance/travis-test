import { LocalStorageService } from './localStorage.service';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import axios from 'axios';

@Injectable()
export class RestClientService {

	public refreshToken: string;
	public accessToken: string;

	private tokenExpireTimestamp: number;
	private restUrl: string;


	constructor(private propyStorage: LocalStorageService) {
		this.restUrl = environment.apiUrl;

		this.accessToken = propyStorage.accessToken;
		this.refreshToken = propyStorage.refreshToken;
		this.tokenExpireTimestamp = propyStorage.tokenExpireTimestamp;
	}

	private get bearerHeaderString(): string {
		if (this.accessToken === undefined) {
			throw new Error('Trying to work without access token');
		}
		return `Bearer ${this.accessToken}`;
	}

	private get bearerHeaderObject(): object {
		return {
			'Authorization': this.bearerHeaderString
		};
	}

	public get isTokenExpired(): boolean {
		const now: Date = new Date();
		return now.getTime() > this.tokenExpireTimestamp;
	}

	public set tokenExpiresIn(expiersInSeconds: number) {
		const expiry: Date = new Date();
		expiry.setSeconds(expiry.getSeconds() + expiersInSeconds);
		this.tokenExpireTimestamp = expiry.getTime();
	}

	private forgeUrl(endpoint: string): string {
		return `${this.restUrl}${endpoint}`;
	}

	/**
	 * get makes a get request without token
	 */
	public get(endpoint: string, config: object) {
		const url = this.forgeUrl(endpoint);
		return axios.get(url, config);
	}

	/**
	 * post - makes a post request without token
	 */
	public post(endpoint: string, data: object, config: object) {
		const url = this.forgeUrl(endpoint);
		return axios.post(url, data, config);
	}

	/**
	 * put - makes a put requiest without token
	 */
	public put(endpoint: string, data: object, config: object) {
		const url = this.forgeUrl(endpoint);
		return axios.put(url, data, config);
	}

	/**
	 * patch - makes a patch requiest without token
	 */
	public patch(endpoint: string, data: object, config: object) {
		const url = this.forgeUrl(endpoint);
		return axios.patch(url, data, config);
	}

	/**
	 * delete makes a delete request without token
	 */
	public delete(endpoint: string, config: object) {
		const url = this.forgeUrl(endpoint);
		return axios.delete(url, config);
	}

	/**
	 * getWithAccessToken - makes a get request and adds the stored access token
	 */
	public getWithAccessToken(endpoint: string, config: object) {
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
	public postWithAccessToken(endpoint: string, data: object, config: object) {
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
	public putWithAccessToken(endpoint: string, data: object, config: object) {
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
	public patchWithAccessToken(endpoint: string, data: object, config: object) {
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
	public deleteWithAccessToken(endpoint: string, config: object) {
		const configWithToken = {
			headers: {
				...this.bearerHeaderObject
			},
			...config
		};

		return this.delete(endpoint, configWithToken);
	}


}
