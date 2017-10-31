import {GoogleMapsMarkersService} from './../shared/google-maps-markers.service';
import {environment} from './../../environments/environment';
import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PropertiesService} from '../properties/properties.service';
import {GetPropertiesResponse} from '../properties/properties-responses';
import {BigNumberFormatPipe} from '../shared/pipes/big-number-format.pipe';
import {CurrencySymbolPipe} from '../shared/pipes/currency-symbol.pipe';
import {ImageEnvironmentPrefixPipe} from '../shared/pipes/image-environment-prefix.pipe';
import {ImageSizePipe} from '../shared/pipes/image-size.pipe';
import {PropertySizeUnitOfMeasurePipe} from '../shared/pipes/property-size-unit-of-measure.pipe';
import {ThousandSeparatorPipe} from '../shared/pipes/thousand-separator.pipe';

@Component({
	selector: 'app-google-map',
	templateUrl: './google-map.component.html',
	styleUrls: ['./google-map.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class GoogleMapComponent implements OnInit {
	@ViewChild('gmap') gmap: ElementRef;
	public map: google.maps.Map;
	public options: any;
	public overlays: any;
	private DEFAULT_LATITUDE = 37.452961;
	private DEFAULT_LONGITUDE = -122.181725;
	private INITIAL_ZINDEX_HOVERED_MARKER = 999;
	private DEFAULT_ZOOM = environment.mapConfig.MAP_DEFAULT_ZOOM;

	constructor(private route: ActivatedRoute,
				private router: Router,
				private propertiesService: PropertiesService,
				private googleMarkersService: GoogleMapsMarkersService,
				private bigNumberPipe: BigNumberFormatPipe,
				private currencySymbolPipe: CurrencySymbolPipe,
				private imageEnvPrefixPipe: ImageEnvironmentPrefixPipe,
				private imageSizePipe: ImageSizePipe,
				private propertyUnitOfMeasurePipe: PropertySizeUnitOfMeasurePipe,
				private thousandSeparatorPipe: ThousandSeparatorPipe,
				private cdr: ChangeDetectorRef) {
	}

	ngOnInit() {
		this.options = {
			center: {lat: this.DEFAULT_LATITUDE, lng: this.DEFAULT_LONGITUDE},
			zoom: this.DEFAULT_ZOOM
		};
	}

	private setMap(event) {
		this.map = event.map;
		this.setupParamsWatcher();
		this.map.addListener('idle', () => this.getProperties(this.map));
	}

	private async getProperties(map: google.maps.Map) {
		const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(
			map.getBounds().getSouthWest().lat(),
			map.getBounds().getNorthEast().lat(),
			map.getBounds().getSouthWest().lng(),
			map.getBounds().getNorthEast().lng());
		this.createMarkers(propertiesResponse);
		setTimeout(() => this.setChanged(), 0);
	}

	private createMarkers(propertiesResponse: GetPropertiesResponse) {
		this.overlays = [];
		for (const property of propertiesResponse.properties) {
			const marker = new google.maps.Marker(
				{
					position: {lat: property.latitude, lng: property.longitude},
					// optimized: false,
					icon: this.googleMarkersService.defaultMarkerSettings,
					label: this.googleMarkersService.getMarkerLabel
					(this.bigNumberPipe.transform(this.currencySymbolPipe.transform(property.price.value.toString()), true))
				});

			const contentString = `<div id="div-main-infoWindow">
					<div id="property-image-holder"
					style="background: url(${this.imageSizePipe.transform(
				this.imageEnvPrefixPipe.transform(property.imageUrls[0]), 254, 155, true)}) no-repeat center center !important;"></div>
					<div class="property-iw-footer">
						<div class="property-info">
							<span class="address">${property.address}</span>
						</div>
						<div class="additional-property-info">
							<span
								*ngIf="property.bedrooms" class="property-bedrooms">${property.bedrooms} bedrooms</span>
							<span *ngIf="property.size.value" class="property-size">
								${this.propertyUnitOfMeasurePipe.transform(property.size.value, property.size.type)}
							</span>
						</div>
						<div class="property-price">
							<span>${this.currencySymbolPipe.transform(this.thousandSeparatorPipe.transform(property.price.value))}</span>
						</div>
					</div>
				</div>`;

			const infoWindow = new google.maps.InfoWindow({
				content: contentString,
				maxWidth: 203,
				pixelOffset: new google.maps.Size(0, 0),
				disableAutoPan: true
			});

			google.maps.event.addListener(marker, 'click', () => {
				this.goToProperty(property.id);
			});
			google.maps.event.addListener(marker, 'mouseover', (event) => {
				marker.setIcon(this.googleMarkersService.hoverMarkerSettings);
				marker.setZIndex(this.INITIAL_ZINDEX_HOVERED_MARKER++);
				infoWindow.open(this.map, marker);
			});
			google.maps.event.addListener(marker, 'mouseout', () => {
				marker.setIcon(this.googleMarkersService.defaultMarkerSettings);
				infoWindow.close();
			});
			google.maps.event.addListener(infoWindow, 'domready', () => {
				document.getElementById('div-main-infoWindow').closest('.gm-style-iw').parentElement.classList.add('custom-iw');
			});
			this.overlays.push(marker);
		}
	}

	private goToProperty(id: string) {
		this.router.navigate(['property', id]);
	}

	private setupParamsWatcher() {
		return this.route.params
			.subscribe(async params => {
				if (!params.latitude || !params.longitude) {
					await this.moveToDefaultLocation();
					return;
				}
				this.map.setCenter(new google.maps.LatLng(+params.latitude, +params.longitude));
			});
	}

	private async moveToDefaultLocation() {
		this.setCurrentPosition();
	}

	private setCurrentPosition() {
		if (!('geolocation' in navigator)) {
			return;
		}

		navigator.geolocation.getCurrentPosition(async (position) => {
			this.map.setCenter(new google.maps.LatLng(position.coords.latitude, position.coords.longitude));
		});
	}

	// Triggering Angular change detection manually, because markers update
	private setChanged() {
		this.cdr.markForCheck();
		if (!this.cdr['destroyed']) {
			this.cdr.detectChanges();
		}
	}
}
