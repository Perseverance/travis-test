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

	constructor(router: Router,
		private route: ActivatedRoute,
		public authService: AuthenticationService,
		public translate: TranslateService,
		private storage: LocalStorageService,
		@Inject(DOCUMENT) private document: Document,
		private momentService: MomentService) {
		super(router, environment.skippedRedirectRoutes, environment.defaultRedirectRoute);
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				this.isUserAnonymous = userInfo.isAnonymous;
				this.userInfo = userInfo.user;
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
		this.authService.performLogout();
	}

	onLocationFoundHandler(latitude: number, longitude: number, locationName: string) {
		this.router.navigate(['map', { latitude, longitude, locationName }]);
	}
}
