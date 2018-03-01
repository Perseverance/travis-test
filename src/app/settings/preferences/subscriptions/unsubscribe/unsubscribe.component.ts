import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { NotificationsService } from './../../../../shared/notifications/notifications.service';
import { ErrorsService } from './../../../../shared/errors/errors.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PreferencesService } from './../../preferences.service';
import { AuthenticationService } from './../../../../authentication/authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { ErrorsDecoratableComponent } from './../../../../shared/errors/errors.decoratable.component';
import { Component, OnInit } from '@angular/core';
import { DefaultAsyncAPIErrorHandling } from '../../../../shared/errors/errors.decorators';

@Component({
	selector: 'app-unsubscribe',
	templateUrl: './unsubscribe.component.html',
	styleUrls: ['./unsubscribe.component.scss']
})
export class UnsubscribeComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {
	private unsubscribeSuccess: string;
	private codeSubscription: Subscription;
	public hasDataLoaded = false;

	constructor(private authService: AuthenticationService,
		private preferencesService: PreferencesService,
		translateService: TranslateService,
		private route: ActivatedRoute,
		private router: Router,
		errorsService: ErrorsService,
		private notificationsService: NotificationsService) {
		super(errorsService, translateService);
	}

	ngOnInit() {
		this.translateService.get([
			'unsubscribe.successfull-unsubscription'
		]).subscribe((translations) => {
			this.unsubscribeSuccess = translations['unsubscribe.successfull-unsubscription'];
			this.codeSubscription = this.setupQueryParamsWatcher();
		});
	}

	ngOnDestroy(): void {
		this.codeSubscription.unsubscribe();
	}

	private setupQueryParamsWatcher() {
		return this.route.queryParams
			.subscribe(async params => {
				if (params.code && params.email) {

					await this.sendUnsubscribeCode(params.code, params.email);

				} else {
					this.errorsService.pushError({
						errorMessage: 'Malformed Link. Please try again the link in your email',
						errorTitle: 'Malformed link.',
						errorTime: (new Date()).getTime()
					});
					this.hasDataLoaded = true;
				}

			});
	}

	@DefaultAsyncAPIErrorHandling('unsubscribe.unsubscribe-error')
	private async sendUnsubscribeCode(code: string, email: string) {
		try {
			await this.preferencesService.emailUnsubscribe(code, email);
			this.notificationsService.pushSuccess({
				title: this.unsubscribeSuccess,
				message: '',
				time: (new Date().getTime()),
				timeout: 4000
			});
			this.moveToHome();
		} catch (error) {
			this.hasDataLoaded = true;
			throw error;
		}
	}

	private moveToHome() {
		this.router.navigate(['/']);
	}

}
