import { GoogleMapsMarkersService } from './../../shared/google-maps-markers.service';
import { CurrencySymbolPipe } from './../../shared/pipes/currency-symbol.pipe';
import { BigNumberFormatPipe } from './../../shared/pipes/big-number-format.pipe';
import { environment } from './../../../environments/environment';
import { NgxCarousel } from 'ngx-carousel';
import { RedirectableComponent } from './../../shared/redirectable/redirectable.component';
import { AuthenticationService } from './../../authentication/authentication.service';
import { PropertiesService } from './../properties.service';
import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
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

	constructor(
		router: Router,
		private route: ActivatedRoute,
		private propertiesService: PropertiesService,
		private authService: AuthenticationService,
		private googleMarkersService: GoogleMapsMarkersService,
		private bigNumberPipe: BigNumberFormatPipe,
		private currencySymbolPipe: CurrencySymbolPipe) {
		super(router);
		this.IMAGE_WIDTH_PX = window.screen.width;
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
		const self = this;
		const idObservable: Observable<string> = self.route.params.map(p => p.id);
		this.idSubscription = idObservable.subscribe(async function (propertyId) {
			const property = await self.propertiesService.getProperty(propertyId);
			self.createAndSetMapOptions(property);
			self.createAndSetPropertyMarker(property);
			self.property = property;
			console.log(self.property);
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

}
