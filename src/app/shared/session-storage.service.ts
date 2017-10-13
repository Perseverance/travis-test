import { Injectable } from '@angular/core';

@Injectable()
export class SessionStorageService {

	private KEY_SESSION_ACCESS_TOKEN = 'propySessionAccessToken';
	private KEY_SESSION_REFRESH_TOKEN = 'propySessionRefreshToken';
	private KEY_SESSION_EXPIRY_TIMESTAMP = 'propySessionExpiryTimestamp';

	constructor() { }

	public set accessToken(token: string) {
		if (token === undefined || token === null || token === '') {
			throw new Error('Trying to set invalid access token!');
		}
		sessionStorage.setItem(this.KEY_SESSION_ACCESS_TOKEN, token);
	}

	public get accessToken(): string {
		return sessionStorage.getItem(this.KEY_SESSION_ACCESS_TOKEN);
	}

	public set refreshToken(token: string) {
		if (token === undefined || token === null || token === '') {
			throw new Error('Trying to set invalid refresh token!');
		}
		sessionStorage.setItem(this.KEY_SESSION_REFRESH_TOKEN, token);
	}

	public get refreshToken(): string {
		return sessionStorage.getItem(this.KEY_SESSION_REFRESH_TOKEN);
	}

	public set tokenExpireTimestamp(expiryTimestamp: number) {
		if (expiryTimestamp === undefined || expiryTimestamp === null) {
			throw new Error('Trying to set invalid expiry timestamp!');
		}

		const now = new Date();

		if (expiryTimestamp <= now.getTime()) {
			throw new Error('Trying to set old expiry timestamp!');
		}

		sessionStorage.setItem(this.KEY_SESSION_EXPIRY_TIMESTAMP, expiryTimestamp.toString());
	}

	public get tokenExpireTimestamp(): number {
		const expiryTimestampString = sessionStorage.getItem(this.KEY_SESSION_EXPIRY_TIMESTAMP);
		return Number.parseInt(expiryTimestampString);
	}

	public removeStoredAccessData() {
		sessionStorage.removeItem(this.KEY_SESSION_ACCESS_TOKEN);
		sessionStorage.removeItem(this.KEY_SESSION_REFRESH_TOKEN);
		sessionStorage.removeItem(this.KEY_SESSION_EXPIRY_TIMESTAMP);
	}

}
