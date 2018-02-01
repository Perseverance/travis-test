import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {UIParams, UIResponse, FacebookService} from 'ngx-facebook';
import {ImageSizePipe} from '../pipes/image-size.pipe';
import {ImageEnvironmentPrefixPipe} from '../pipes/image-environment-prefix.pipe';
import {PropertyConversionService} from '../property-conversion.service';
import {MetaService} from '@ngx-meta/core';
import {AuthenticationService} from '../../authentication/authentication.service';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {RedirectableComponent} from '../redirectable/redirectable.component';
import {environment} from '../../../environments/environment';

@Component({
	selector: 'app-facebook-share',
	templateUrl: './facebook-share.component.html',
	styleUrls: ['./facebook-share.component.scss']
})
export class FacebookShareComponent extends RedirectableComponent implements OnInit {
	@Input() property: any;
	public isSpecialShare: boolean;
	private metaTitle = 'Buy or sell investment properties';

	constructor(private fb: FacebookService,
				private imageSizePipe: ImageSizePipe,
				private imageEnvironmentPrefixPipe: ImageEnvironmentPrefixPipe,
				private propertyConversionService: PropertyConversionService,
				private metaService: MetaService,
				private authService: AuthenticationService,
				public router: Router,
				private route: ActivatedRoute) {
		super(router, environment.skippedRedirectRoutes, environment.defaultRedirectRoute);
	}

	ngOnInit() {
	}

	public async shareInFacebook() {
		const isUserAnonymous = this.authService.isUserAnonymous;
		if (isUserAnonymous) {
			const queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);
			queryParams['redirect'] = this.componentUrl;
			this.router.navigate(['signup'], {queryParams: queryParams});
			return;
		}

		this.setupMetaTags(this.property);
		const url = window.location.href;
		const params: UIParams = {
			href: url,
			method: 'share'
		};

		this.fb.ui(params)
			.then((res: UIResponse) => {
				this.revertMetaTitle();
			})
			.catch((e: any) => {
				this.revertMetaTitle();
				console.error(e);
			});

	}

	private setupMetaTags(property: any) {
		const imgUrl = this.imageSizePipe.transform(this.imageEnvironmentPrefixPipe.transform(property.imageUrls[0]), 1200, 630);
		const propertyType = this.propertyConversionService.getPropertyTypeName(property.type);
		let title = `${propertyType} in `;
		if (property.city) {
			title += property.city;
		} else {
			title += property.address;
		}
		this.metaService.setTitle(title);
		this.metaService.setTag('og:image', imgUrl);
		this.metaService.setTag('og:url', window.location.href);
	}

	private revertMetaTitle() {
		this.metaService.setTitle(this.metaTitle);
	}
}