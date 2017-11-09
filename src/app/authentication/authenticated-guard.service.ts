import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService, UserData } from './authentication.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {
	constructor(private authService: AuthenticationService) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const subscription = this.authService.subscribeToUserData({
				next: (userInfo: UserData) => {
					resolve(!userInfo.isAnonymous);
					subscription.unsubscribe();
				}
			});
		});
	}

}
