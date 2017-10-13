import { Injectable } from '@angular/core';

@Injectable()
export class LocalStorageService {

	private KEY_ACCESS_TOKEN = 'propyAccessToken';
	private KEY_REFRESH_TOKEN = 'propyRefreshToken';
	private KEY_EXPIRY_TIMESTAMP = 'propyExpiryTimestamp';
	private KEY_SELECTED_LANGUAGE = 'selectedLanguage';

	constructor() {
	}

	public set accessToken(token: string) {
		if (token === undefined || token === null || token === '') {
			throw new Error('Trying to set invalid access token!');
		}
		localStorage.setItem(this.KEY_ACCESS_TOKEN, token);
	}

	public get accessToken(): string {
		return localStorage.getItem(this.KEY_ACCESS_TOKEN);
	}

	public set refreshToken(token: string) {
		if (token === undefined || token === null || token === '') {
			throw new Error('Trying to set invalid refresh token!');
		}
		localStorage.setItem(this.KEY_REFRESH_TOKEN, token);
	}

	public get refreshToken(): string {
		return localStorage.getItem(this.KEY_REFRESH_TOKEN);
	}

	public set tokenExpireTimestamp(expiryTimestamp: number) {
		if (expiryTimestamp === undefined || expiryTimestamp === null) {
			throw new Error('Trying to set invalid expiry timestamp!');
		}

		const now = new Date();

		if (expiryTimestamp <= now.getTime()) {
			throw new Error('Trying to set old expiry timestamp!');
		}

		localStorage.setItem(this.KEY_EXPIRY_TIMESTAMP, expiryTimestamp.toString());
	}

	public get tokenExpireTimestamp(): number {
		const expiryTimestampString = localStorage.getItem(this.KEY_EXPIRY_TIMESTAMP);
		return Number.parseInt(expiryTimestampString);
	}

	public set selectedLanguage(selectedLanguage: string) {
		if (selectedLanguage === undefined || selectedLanguage === null || selectedLanguage === '') {
			throw new Error('Trying to set invalid language!');
		}
		localStorage.setItem(this.KEY_SELECTED_LANGUAGE, selectedLanguage);
	}

	public get selectedLanguage(): string {
		const storedLanguage = localStorage.getItem(this.KEY_SELECTED_LANGUAGE);
		if (storedLanguage == null) {
			return navigator.language.substring(0, 2);
		}
		return storedLanguage;
	}

	public removeStoredAccessData() {
		localStorage.removeItem(this.KEY_ACCESS_TOKEN);
		localStorage.removeItem(this.KEY_REFRESH_TOKEN);
		localStorage.removeItem(this.KEY_EXPIRY_TIMESTAMP);
	}

}
