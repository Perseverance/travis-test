import { TranslateService } from '@ngx-translate/core';
import { GoogleMapsMarkersService } from './../../shared/google-maps-markers.service';
import { CurrencySymbolPipe } from './../../shared/pipes/currency-symbol.pipe';
import { BigNumberFormatPipe } from './../../shared/pipes/big-number-format.pipe';
import { environment } from './../../../environments/environment';
import { NgxCarousel } from 'ngx-carousel';
import { RedirectableComponent } from './../../shared/redirectable/redirectable.component';
import { AuthenticationService } from './../../authentication/authentication.service';
import { PropertiesService } from './../properties.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation, ApplicationRef, NgZone, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

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

	constructor(
		router: Router,
		private route: ActivatedRoute,
		private propertiesService: PropertiesService,
		private authService: AuthenticationService,
		private googleMarkersService: GoogleMapsMarkersService,
		private bigNumberPipe: BigNumberFormatPipe,
		private currencySymbolPipe: CurrencySymbolPipe,
		private appRef: ApplicationRef,
		private zone: NgZone,
		private translateService: TranslateService) {
		super(router);
		this.IMAGE_WIDTH_PX = window.screen.width * 0.583;
		this.IMAGE_HEIGHT_PX = 480;

	}

	async ngOnInit() {
		this.propertyImagesCarouselConfig = {
			grid: { xs: 1, sm: 1, md: 1, lg: 1, all: 0 },
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
			self.createAndSetMapOptions(property);
			self.createAndSetPropertyMarker(property);
			self.property = property;
			// NOTICE: Fixes buggy angular not redrawing when there is google map in the view
			self.zone.run(() => { });
		});


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
		this.zone.run(() => { });
	}
}
