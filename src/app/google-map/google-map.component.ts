import {PropertiesFilter} from './../properties/properties.service';
import {GoogleMapsMarkersService} from './../shared/google-maps-markers.service';
import {environment} from './../../environments/environment';
import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation, NgZone} from '@angular/core';
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
	public overlays = new Array<any>();
	public properties: any[];
	public propertiesLoading = false;

	private DEFAULT_LATITUDE = 37.452961;
	private DEFAULT_LONGITUDE = -122.181725;
	private INITIAL_ZINDEX_HOVERED_MARKER = 999;
	private DEFAULT_ZOOM = environment.mapConfig.MAP_DEFAULT_ZOOM;

	private XS_SIZE_PX = 768;
	private filterObject: PropertiesFilter;
	private currentCenter: google.maps.LatLng;
	private currentSouthWestRect: google.maps.LatLng;
	private currentNorthEastRect: google.maps.LatLng;

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
				private zone: NgZone) {
	}

	ngOnInit() {
		this.options = {
			center: {lat: this.DEFAULT_LATITUDE, lng: this.DEFAULT_LONGITUDE},
			zoom: this.DEFAULT_ZOOM
		};
		if (this.isSizeXs) {
			this.setupParamsWatcher();
		}
	}

	private get isSizeXs(): boolean {
		return window.innerWidth < this.XS_SIZE_PX;
	}

	private setupParamsWatcher() {
		return this.route.params
			.subscribe(async params => {
				if (!params.latitude || !params.longitude) {
					await this.moveToDefaultLocation();
					return;
				}
				this.moveToLocation(+params.latitude, +params.longitude);
			});
	}

	private moveToLocation(latitude: number, longitude: number) {
		if (this.isSizeXs) {
			this.getCenterProperties(new google.maps.LatLng(latitude, longitude), this.filterObject);
			return;
		}
		if (!this.map) {
			return;
		}
		this.map.setCenter(new google.maps.LatLng(latitude, longitude));
	}

	private async moveToDefaultLocation() {
		this.setCurrentPosition();
	}

	private setCurrentPosition() {
		if (!('geolocation' in navigator)) {
			return;
		}

		navigator.geolocation.getCurrentPosition(async (position) => {
			this.moveToLocation(position.coords.latitude, position.coords.longitude);
		});
	}

	public onFilterChanged(event: PropertiesFilter) {
		this.filterObject = event;
		if (this.isSizeXs) {
			if (!this.currentCenter) {
				return;
			}
			this.getCenterProperties(this.currentCenter, event);
			return;
		}

		if (!this.currentSouthWestRect || !this.currentNorthEastRect) {
			return;
		}
		this.getBoundsProperties(this.currentSouthWestRect, this.currentNorthEastRect, event);
	}

	public setMap(event) {
		this.map = event.map;
		if (!this.isSizeXs) {
			this.setupParamsWatcher();
		}
		this.map.addListener('idle', () => {
			if (this.isSizeXs) {
				// This stops the map removing the list contents
				return;
			}
			this.getBoundsProperties(this.map.getBounds().getSouthWest(), this.map.getBounds().getNorthEast(), this.filterObject);
		});
	}

	private async getBoundsProperties(southWest: google.maps.LatLng, northEast: google.maps.LatLng, filter: PropertiesFilter) {
		try {
			this.propertiesLoading = true;
			this.currentSouthWestRect = southWest;
			this.currentNorthEastRect = northEast;
			const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(
				southWest.lat(),
				northEast.lat(),
				southWest.lng(),
				northEast.lng(), filter);
			this.properties = propertiesResponse.properties;
			this.propertiesLoading = false;
			if (!this.isSizeXs) {
				this.createMarkers(propertiesResponse);
			}
			// NOTICE: Fixes buggy angular not redrawing when there is google map in the view
			this.zone.run(() => {
			});

		} catch (error) {
			this.propertiesLoading = false;
		}
	}

	private async getCenterProperties(center: google.maps.LatLng, filter: PropertiesFilter) {
		try {
			this.propertiesLoading = true;
			this.currentCenter = center;
			const propertiesResponse = await this.propertiesService.getPropertiesByCenter(center.lat(), center.lng(), filter);
			this.properties = propertiesResponse.properties;
			this.propertiesLoading = false;
			if (!this.isSizeXs) {
				this.createMarkers(propertiesResponse);
			}
			// NOTICE: Fixes buggy angular not redrawing when there is google map in the view
			this.zone.run(() => {
			});
		} catch (error) {
			this.propertiesLoading = false;
		}
	}

	private createMarkers(propertiesResponse: GetPropertiesResponse) {
		this.overlays = new Array<any>();
		for (const property of propertiesResponse.properties) {
			const marker = new google.maps.Marker(
				{
					position: {lat: property.latitude, lng: property.longitude},
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
			google.maps.event.addListener(marker, 'mouseover', () => {
				marker.setIcon(this.googleMarkersService.hoverMarkerSettings);
				marker.setZIndex(this.INITIAL_ZINDEX_HOVERED_MARKER++);
				const label = marker.getLabel();
				label.color = this.googleMarkersService.getMarkerLabelColorOnHover();
				marker.setLabel(label);
				infoWindow.open(this.map, marker);
			});
			google.maps.event.addListener(marker, 'mouseout', () => {
				marker.setIcon(this.googleMarkersService.defaultMarkerSettings);
				const label = marker.getLabel();
				label.color = this.googleMarkersService.getMarkerLabelColor();
				marker.setLabel(label);
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

}