import { ErrorsService } from './../../shared/errors/errors.service';
import { SETTINGS_TABS } from './../../settings/settings/settings.component';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { DefaultLanguage } from './../i18nSetup';
import { environment } from './../../../environments/environment';
import { RedirectableComponent } from './../../shared/redirectable/redirectable.component';
import { Component, OnInit, HostListener, Inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LocalStorageService } from '../../shared/localStorage.service';
import { Router, ActivatedRoute, NavigationEnd, UrlSegment } from '@angular/router';
import { DOCUMENT } from '@angular/platform-browser';
import { MomentService } from '../../shared/moment.service';
import { PusherService } from '../../shared/pusher.service';


@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.scss']
})
export class HeaderComponent extends RedirectableComponent implements OnInit {

	private _lastHeaderScrollTop: number;
	public isHeaderScrolledPastThreshold = false;

	private HEADER_CHANGE_THRESHOLD_PX = 1;

	public hasUserLoaded = false;
	public isUserAnonymous: boolean;
	public userInfo: any;
	public isLanding = false;
	public settingsTabs = SETTINGS_TABS;
	public isEmailVerified = false;
	public newNotifications = false;
	public isNotificationsMenuShown = false;
	private verificationError: string;
	private verificationMessage: string;
	public numberOfNotifications: number;
	private notLoggedInError: string;

	constructor(router: Router,
		private route: ActivatedRoute,
		public authService: AuthenticationService,
		public translate: TranslateService,
		private storage: LocalStorageService,
		private errorsService: ErrorsService,
		private translateService: TranslateService,
		@Inject(DOCUMENT) private document: Document,
		private momentService: MomentService,
		public pusherService: PusherService) {
		super(router, environment.skippedRedirectRoutes, environment.defaultRedirectRoute);
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				this.isUserAnonymous = userInfo.isAnonymous;
				this.userInfo = userInfo.user;
				if (this.userInfo) {
					this.isEmailVerified = this.userInfo.isEmailVerified;
				}

				this.hasUserLoaded = true;
			}
		});
	}

	async ngOnInit() {
		this.setIsHeaderScrolledPastThreshold();
		this.router.events
			.filter(event => event instanceof NavigationEnd)
			.subscribe((event: NavigationEnd) => {
				this.isLanding = (event.url === '/');
			});


		this.translateService.stream([
			'list-property.verification-error',
			'list-property.verification-error-message',
			'common.only-registered-error'
		]).subscribe((translations) => {
			this.verificationError = translations['list-property.verification-error'];
			this.verificationMessage = translations['list-property.verification-error-message'];
			this.notLoggedInError = translations['common.only-registered-error'];

		});
	}

	@HostListener('window:scroll', ['$event'])
	onScrollEvent($event) {
		this.setIsHeaderScrolledPastThreshold();
	}

	private getHeaderPosition(): number {
		return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
	}

	private setIsHeaderScrolledPastThreshold() {
		this._lastHeaderScrollTop = this.getHeaderPosition();
		if (!this.isHeaderScrolledPastThreshold && this._lastHeaderScrollTop > this.HEADER_CHANGE_THRESHOLD_PX) {
			this.isHeaderScrolledPastThreshold = true;
			return;
		}
		if (this.isHeaderScrolledPastThreshold && this._lastHeaderScrollTop <= this.HEADER_CHANGE_THRESHOLD_PX) {
			this.isHeaderScrolledPastThreshold = false;
			return;
		}
	}

	public get logoImage(): string {
		if (this.isHeaderScrolledPastThreshold) {
			return 'assets/images/propy-logo-gray.png';
		} else {
			return 'assets/images/propy-logo-white.png';
		}
	}


	public selectLanguage(lang: string) {
		this.translate.use(lang);
		this.momentService.moment.locale(lang);
		this.storage.selectedLanguage = lang;
	}

	public logout(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		this.router.navigate(['/']);
		const userId = this.userInfo.id;
		this.authService.performLogout();
		// ToDo: Comment out when start to use pusher
		// this.pusherService.unsubscribePusherChannel(userId);
	}

	public goListProperty(event: Event) {
		event.preventDefault();
		event.stopPropagation();
		if (this.isUserAnonymous) {
			this.errorsService.pushError({
				errorTitle: '',
				errorMessage: this.notLoggedInError,
				errorTime: (new Date()).getDate()
			});
			return;
		}
		if (!this.isEmailVerified) {
			this.errorsService.pushError({
				errorTitle: this.verificationError,
				errorMessage: this.verificationMessage,
				errorTime: (new Date()).getDate()
			});
			return;
		}
		this.router.navigate(['/list-property']);
	}

	onLocationFoundHandler(latitude: number, longitude: number, locationName: string) {
		this.router.navigate(['map', { latitude, longitude, locationName }]);
	}

	public onNewNotifications(event) {
		//this.newNotifications = event;
		if (event.newNotifications > 0) {
			this.newNotifications = true;
		}
		this.numberOfNotifications = event.newNotifications;
	}
	public onToggleNotifications() {
		this.isNotificationsMenuShown = !this.isNotificationsMenuShown;
		this.newNotifications = false;
		this.numberOfNotifications = 0;
	}
}
