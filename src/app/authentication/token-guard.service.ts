import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from './authentication.service';

@Injectable()
export class TokenGuard implements CanActivate {
	constructor(private authService: AuthenticationService) {
	}

	async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

		if (this.authService.hasAuthCredentials) {
			const result = await this.authService.refreshStoredAccessToken();
			const refreshWasNotNeeded = null;
			if (result || result === refreshWasNotNeeded) {
				return true;
			}
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
