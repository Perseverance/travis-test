import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService, UserData } from './authentication.service';

@Injectable()
export class NotAuthenticatedGuard implements CanActivate {
	constructor(private router: Router, private authService: AuthenticationService) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return new Promise((resolve, reject) => {
			const subscription = this.authService.subscribeToUserData({
				next: (userInfo: UserData) => {
					if (!userInfo.isAnonymous) {
						this.router.navigate([`/`]);
					}
					resolve(userInfo.isAnonymous);
					subscription.unsubscribe();
				}
			});
		});
	}

}
