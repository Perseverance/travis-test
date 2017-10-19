import {Injectable} from '@angular/core';
import {CurrencyTypeEnum} from './enums/currency-type.enum';
import {LanguagesEnum} from './enums/supported-languages.enum';

@Injectable()
export class LocalStorageService {

	private KEY_ACCESS_TOKEN = 'propyAccessToken';
	private KEY_REFRESH_TOKEN = 'propyRefreshToken';
	private KEY_EXPIRY_TIMESTAMP = 'propyExpiryTimestamp';
	private KEY_SELECTED_LANGUAGE = 'selectedLanguage';
	private KEY_CURRENCY_TYPE = 'currencyType';

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

	public set selectedCurrencyType(selectedCurrencyType: number) {
		if (selectedCurrencyType === undefined || selectedCurrencyType === null) {
			throw new Error('Trying to set invalid currency type!');
		}
		// Initial currency
		if (selectedCurrencyType === CurrencyTypeEnum.NONE) {
			const storedCurrencyType = localStorage.getItem(this.KEY_CURRENCY_TYPE);
			if (storedCurrencyType == null) {
				const initialCurrencyType = this.initialCurrencyType();
				localStorage.setItem(this.KEY_CURRENCY_TYPE, initialCurrencyType.toString());
			}
		} else {
			localStorage.setItem(this.KEY_CURRENCY_TYPE, selectedCurrencyType.toString());
		}
	}

	public get selectedCurrencyType(): number {
		const storedCurrencyType = localStorage.getItem(this.KEY_CURRENCY_TYPE);
		if (storedCurrencyType == null) {
			const initialCurrencyType = this.initialCurrencyType();
			return initialCurrencyType;
		}
		return +storedCurrencyType;
	}

	public removeStoredAccessData() {
		localStorage.removeItem(this.KEY_ACCESS_TOKEN);
		localStorage.removeItem(this.KEY_REFRESH_TOKEN);
		localStorage.removeItem(this.KEY_EXPIRY_TIMESTAMP);
	}

	private initialCurrencyType() {
		let lang: string;
		if (localStorage.selectedLanguage === undefined || localStorage.selectedLanguage === null || localStorage.selectedLanguage === '') {
			lang = navigator.language.substring(0, 2);
		} else {
			lang = localStorage.selectedLanguage;
		}
		switch (lang) {
			case LanguagesEnum.RUSSIAN: {
				return CurrencyTypeEnum.RUB;
			}
			case LanguagesEnum.ARABIC: {
				return CurrencyTypeEnum.AED;
			}
			case LanguagesEnum.CHINESE: {
				return CurrencyTypeEnum.CNY;
			}
			default: {
				return CurrencyTypeEnum.USD;
			}
		}
	}
}
