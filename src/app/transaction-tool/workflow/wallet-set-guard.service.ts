import { UserData } from './../../authentication/authentication.service';
import { Injectable } from '@angular/core';
import {
	CanActivate, Router,
	ActivatedRouteSnapshot,
	RouterStateSnapshot
} from '@angular/router';
import { AuthenticationService } from '../../authentication/authentication.service';
import { ErrorsDecoratableComponent } from '../../shared/errors/errors.decoratable.component';
import { ErrorsService } from '../../shared/errors/errors.service';
import { TranslateService } from '@ngx-translate/core';


@Injectable()
export class WalletSetGuard extends ErrorsDecoratableComponent implements CanActivate {
	constructor(private router: Router, private authService: AuthenticationService, errorsService: ErrorsService, translateService: TranslateService) {
		super(errorsService, translateService);
	}

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {

		return new Promise((resolve, reject) => {
			const self = this;
			const subscription = this.authService.subscribeToUserData({
				next: (userInfo: UserData) => {
					if (!userInfo.user.jsonFile) {
						self.router.navigate(['/settings']);
						this.errorsService.pushError({
							errorTitle: 'In order to proceed with a deal, you need to have a wallet generated. Please generate one in the PRO wallet section.',
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
