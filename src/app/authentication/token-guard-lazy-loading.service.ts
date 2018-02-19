import { Injectable } from '@angular/core';
import { CanLoad, Route } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class TokenGuardLazyLoading implements CanLoad {
	constructor(private authService: AuthenticationService) {
	}

	async canLoad(route: Route): Promise<boolean> {

		if (this.authService.hasAuthCredentials) {
			return await this.authService.refreshStoredAccessToken();
		}

		return await this.getToken();
	}

	async getToken(): Promise<boolean> {
		await this.authService.refreshTokenOrLoginAnonym();

		if (!this.authService.hasAuthCredentials) {
			throw new Error('Could not get auth credentials');
		}
		return true;
	}
}
