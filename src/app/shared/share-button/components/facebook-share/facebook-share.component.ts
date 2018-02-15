import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UIParams, UIResponse, FacebookService} from 'ngx-facebook';
import {ImageSizePipe} from '../../../pipes/image-size.pipe';
import {ImageEnvironmentPrefixPipe} from '../../../pipes/image-environment-prefix.pipe';
import {PropertyConversionService} from '../../../property-conversion.service';
import {MetaService} from '@ngx-meta/core';
import {AuthenticationService} from '../../../../authentication/authentication.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RedirectableComponent} from '../../../redirectable/redirectable.component';
import {environment} from '../../../../../environments/environment';
import {PropertiesService} from '../../../../properties/properties.service';
import {TranslateService} from '@ngx-translate/core';
import {NotificationsService} from '../../../notifications/notifications.service';

@Component({
	selector: 'app-facebook-share',
	templateUrl: './facebook-share.component.html',
	styleUrls: ['./facebook-share.component.scss']
})
export class FacebookShareComponent extends RedirectableComponent implements OnInit {
	@Input() property: any;
	@Input() userInfo: any;
	@Input() isFeaturedProperty: boolean;
	private propertyRoute = 'property';
	private refIdRoute = 'refId';
	private isAnonymous: boolean;
	private notLoggedInError: string;

	constructor(private fb: FacebookService,
				private propertiesService: PropertiesService,
				private translateService: TranslateService,
				private authService: AuthenticationService,
				public router: Router,
				private route: ActivatedRoute,
				private notificationService: NotificationsService) {
		super(router, environment.skippedRedirectRoutes, environment.defaultRedirectRoute);
	}

	ngOnInit() {
		this.translateService.stream([
			'common.only-registered-share'
		]).subscribe((translations) => {
			this.notLoggedInError = translations['common.only-registered-share'];

		});
	}

	public async shareInFacebook() {
		this.isAnonymous = this.authService.isUserAnonymous;
		if (this.isAnonymous && this.isFeaturedProperty) {
			this.notificationService.pushInfo({
				title: this.notLoggedInError,
				message: '',
				time: (new Date().getTime()),
				timeout: 5000
			});
			const queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
			queryParams['redirect'] = this.componentUrl;
			this.router.navigate(['signup'], {queryParams: queryParams});
			return;
		}

		const url = `${window.location.protocol}//${window.location.host}/${this.propertyRoute}/${this.property.id}`;
		// if (!this.isAnonymous) {
		// 	url = `${url}/${this.refIdRoute}/${this.userInfo.user.id}`;
		// }

		const params: UIParams = {
			href: url,
			method: 'share'
		};

		this.fb.ui(params)
			.then(async (res: UIResponse) => {
				if (this.property.isShareRewardEnabled) {
					await this.propertiesService.socialMediaShare(this.property.id);
					this.authService.getCurrentUser();
					this.property.isShareRewardEnabled = false;
				}
			})
			.catch((e: any) => {
				console.error(e);
			});

	}
}
