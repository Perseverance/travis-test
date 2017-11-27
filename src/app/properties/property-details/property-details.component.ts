import { GoogleAnalyticsEventsService } from './../../shared/google-analytics.service';
import { PropertyConversionService } from './../../shared/property-conversion.service';
import { ImageEnvironmentPrefixPipe } from './../../shared/pipes/image-environment-prefix.pipe';
import { ImageSizePipe } from './../../shared/pipes/image-size.pipe';
import { TranslateService } from '@ngx-translate/core';
import { GoogleMapsMarkersService } from './../../shared/google-maps-markers.service';
import { CurrencySymbolPipe } from './../../shared/pipes/currency-symbol.pipe';
import { BigNumberFormatPipe } from './../../shared/pipes/big-number-format.pipe';
import { environment } from './../../../environments/environment';
import { NgxCarousel } from 'ngx-carousel';
import { RedirectableComponent } from './../../shared/redirectable/redirectable.component';
import { AuthenticationService } from './../../authentication/authentication.service';
import { PropertiesService } from './../properties.service';
import {
	Component,
	OnInit,
	OnDestroy,
	ViewEncapsulation,
	ApplicationRef,
	NgZone,
	ViewChild,
	ElementRef
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { log } from 'util';
import { MetaService } from '@ngx-meta/core';
import { UIParams, UIResponse, FacebookService } from 'ngx-facebook';

@Component({
	selector: 'app-property-details',
	templateUrl: './property-details.component.html',
	styleUrls: ['./property-details.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PropertyDetailsComponent extends RedirectableComponent implements OnInit, OnDestroy {

	public property: any;
	public options: any;
	public overlays: any[];
	private idSubscription: Subscription;
	public propertyImagesCarouselConfig: NgxCarousel;
	public IMAGE_HEIGHT_PX: number;
	public IMAGE_WIDTH_PX: number;
	private DEFAULT_ZOOM = environment.mapConfig.MAP_DEFAULT_ZOOM;
	@ViewChild('gmap') map: any;

	public featureScale: object;
	public publicTransportScale: object;
	public binaryScale: object;

	public isPropertyReserved = false;
	public isPropertyReservedByYou = false;
	constructor(
		router: Router,
		private route: ActivatedRoute,
		private propertiesService: PropertiesService,
		private authService: AuthenticationService,
		private googleMarkersService: GoogleMapsMarkersService,
		private bigNumberPipe: BigNumberFormatPipe,
		private imageSizePipe: ImageSizePipe,
		private imageEnvironmentPrefixPipe: ImageEnvironmentPrefixPipe,
		private currencySymbolPipe: CurrencySymbolPipe,
		private propertyConversionService: PropertyConversionService,
		private fb: FacebookService,
		private appRef: ApplicationRef,
		private zone: NgZone,
		private translateService: TranslateService,
		private metaService: MetaService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {

		super(router);
		this.IMAGE_WIDTH_PX = window.screen.width * 0.6;
		this.IMAGE_HEIGHT_PX = 480;
	}

	async ngOnInit() {
		this.googleAnalyticsEventsService.setPageViewEvent('page-property', 'property');
		this.propertyImagesCarouselConfig = {
			grid: { xs: 1, sm: 1, md: 2, lg: 2, all: 0 },
			slide: 1,
			speed: 600,
			point: {
				visible: true,
				pointStyles: `.ngxcarouselPoint {display: none}` // Removing the points as the visible: false property does not work
			},
			easing: 'ease'
		};
		this.translateService.stream([
			'common.scales.undefined',
			'common.scales.feature-scale.no',
			'common.scales.feature-scale.low',
			'common.scales.feature-scale.moderate',
			'common.scales.feature-scale.high',
			'common.scales.public-transport-scale.low',
			'common.scales.public-transport-scale.medium',
			'common.scales.public-transport-scale.good',
			'common.scales.public-transport-scale.excellent',
			'common.scales.binary-scale.yes',
			'common.scales.binary-scale.no'
		]).subscribe((translations) => {
			this.featureScale = {
				undefined: translations['common.scales.undefined'],
				0: translations['common.scales.undefined'],
				1: translations['common.scales.feature-scale.no'],
				2: translations['common.scales.feature-scale.low'],
				3: translations['common.scales.feature-scale.moderate'],
				4: translations['common.scales.feature-scale.high']
			};

			this.publicTransportScale = {
				undefined: translations['common.scales.undefined'],
				0: translations['common.scales.undefined'],
				2: translations['common.scales.public-transport-scale.low'],
				1: translations['common.scales.public-transport-scale.medium'],
				3: translations['common.scales.public-transport-scale.good'],
				4: translations['common.scales.public-transport-scale.excellent']
			};

			this.binaryScale = {
				undefined: translations['common.scales.undefined'],
				0: translations['common.scales.undefined'],
				1: translations['common.scales.binary-scale.yes'],
				2: translations['common.scales.binary-scale.no']
			};

		});
		const self = this;
		const idObservable: Observable<string> = self.route.params.map(p => p.id);
		this.idSubscription = idObservable.subscribe(async function (propertyId) {
			const property = await self.propertiesService.getProperty(propertyId);
			self.setupMetaTags(property);
			self.createAndSetMapOptions(property);
			self.createAndSetPropertyMarker(property);
			self.property = property;
			self.checkIfPropertyReservedByYou(property);
			// NOTICE: Fixes buggy angular not redrawing when there is google map in the view
			self.zone.run(() => {
			});
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

	private createAndSetMapOptions(property: any) {
		this.options = {
			center: { lat: property.latitude, lng: property.longitude },
			zoom: this.DEFAULT_ZOOM
		};
	}

	private createAndSetPropertyMarker(property: any) {
		const marker = new google.maps.Marker(
			{
				position: { lat: property.latitude, lng: property.longitude },
				icon: this.googleMarkersService.defaultMarkerSettings,
				label: this.googleMarkersService.getMarkerLabel
					(this.bigNumberPipe.transform(this.currencySymbolPipe.transform(property.price.value.toString()), true))
			});
		this.overlays = [marker];
	}

	ngOnDestroy() {
		this.idSubscription.unsubscribe();
	}

	public draw() {
		console.log(this.map);
		google.maps.event.trigger(this.map.el.nativeElement, 'resize');
		this.zone.run(() => {
		});
	}

	public shareInFacebook() {

		const url = window.location.href;
		const params: UIParams = {
			href: url,
			method: 'share'
		};

		this.fb.ui(params)
			.then((res: UIResponse) => {
			})
			.catch((e: any) => console.error(e));

	}

	private async checkIfPropertyReservedByYou(property: any) {
		this.isPropertyReserved = (property.reservedByUserId && property.reservedByUserId.length > 0);
		if (!this.isPropertyReserved) {
			return;
		}

		const currentUser = await this.authService.getCurrentUser();
		this.isPropertyReservedByYou = (currentUser.data.data.id === property.reservedByUserId);
	}
}
