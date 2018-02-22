import { Subscription } from 'rxjs/Subscription';
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService, UserData } from './authentication.service';
import { ErrorsService } from '../shared/errors/errors.service';

@Injectable()
export class AuthenticatedGuard implements CanActivate {

	private subscription: Subscription;
	constructor(private router: Router, private authService: AuthenticationService, private errorsService: ErrorsService) {
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return new Promise((resolve, reject) => {
			this.authService.subscribeToUserDataOnce({
				next: (userInfo: UserData) => {
					if (userInfo.isAnonymous) {
						this.router.navigate(['/']);
						this.errorsService.pushError({
							errorTitle: 'You are not allowed to access this page.',
							errorMessage: '',
							errorTime: (new Date()).getTime()
						});
						resolve(false);
						return;
					}

					resolve(true);
				}
			});
		});
	}

}
