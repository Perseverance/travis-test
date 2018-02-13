import { UserData } from './../../authentication/authentication.service';
import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';


@Injectable()
export class WalletSetGuard implements CanActivate {
	constructor(private router: Router, private authService: AuthenticationService) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

		return new Promise((resolve, reject) => {
			const self = this;
			const subscription = this.authService.subscribeToUserData({
				next: (userInfo: UserData) => {
					if (!!userInfo.user.jsonFile) {
						self.router.navigate(['/']);
						resolve(false);
						return;
					}

					resolve(true);
					subscription.unsubscribe();
				}
			});
		});
	}

}
