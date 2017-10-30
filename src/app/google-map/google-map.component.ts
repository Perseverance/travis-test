import {ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {PropertiesService} from '../properties/properties.service';
import {GetPropertiesResponse} from '../properties/properties-responses';
import {BigNumberFormatPipe} from '../shared/pipes/big-number-format.pipe';
import {CurrencySymbolPipe} from '../shared/pipes/currency-symbol.pipe';

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
	private DEFAULT_ZOOM = 12;
	private DEFAULT_MARKER_ICON = '../../assets/images/marker-shape.png';
	private DEFAULT_MARKER_ICON_HOVERED = '../../assets/images/marker-shape-hovered.png';
	private DEFAULT_MARKER_LABEL_COLOR = '#18ADE2';
	private DEFAULT_MARKER_LABEL_FONT_SIZE = '12px';
	private MARKER_ICON_SETTINGS = {
		url: this.DEFAULT_MARKER_ICON,
		size: new google.maps.Size(50, 30),
		scaledSize: new google.maps.Size(50, 30),
		labelOrigin: new google.maps.Point(25, 12)
	};

	constructor(private route: ActivatedRoute,
				private router: Router,
				private propertiesService: PropertiesService,
				private bigNumberPipe: BigNumberFormatPipe,
				private currencySymbolPipe: CurrencySymbolPipe,
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
					icon: this.MARKER_ICON_SETTINGS,
					label: {
						text: this.bigNumberPipe.transform(this.currencySymbolPipe.transform(property.price.value.toString()), true),
						color: this.DEFAULT_MARKER_LABEL_COLOR,
						fontSize: this.DEFAULT_MARKER_LABEL_FONT_SIZE
					}
				});

			const contentString = '<div id="content">' +
				'<div id="siteNotice">' +
				'</div>' +
				'<h1 id="firstHeading" class="firstHeading">Uluru</h1>' +
				'<div id="bodyContent">' +
				'<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">' +
				'https://en.wikipedia.org/w/index.php?title=Uluru</a> ' +
				'(last visited June 22, 2009).</p>' +
				'</div>' +
				'</div>';

			const infoWindow = new google.maps.InfoWindow({
				content: contentString,
				maxWidth: 200
			});

			google.maps.event.addListener(marker, 'click', () => {
				this.goToProperty(property.id);
			});
			google.maps.event.addListener(marker, 'mouseover', () => {
				let icon = marker.getIcon();
				this.MARKER_ICON_SETTINGS.url = this.DEFAULT_MARKER_ICON_HOVERED;
				this.MARKER_ICON_SETTINGS.size = new google.maps.Size(50, 30);
				this.MARKER_ICON_SETTINGS.scaledSize = new google.maps.Size(50, 30);
				icon = this.MARKER_ICON_SETTINGS;
				marker.setIcon(icon);
				infoWindow.open(this.map, marker);
			});
			google.maps.event.addListener(marker, 'mouseout', () => {
				const label = marker.getLabel();
				label.color = this.DEFAULT_MARKER_LABEL_COLOR;
				marker.setLabel(label);
				let icon = marker.getIcon();
				this.MARKER_ICON_SETTINGS.url = this.DEFAULT_MARKER_ICON;
				this.MARKER_ICON_SETTINGS.size = new google.maps.Size(50, 30);
				this.MARKER_ICON_SETTINGS.scaledSize = new google.maps.Size(50, 30);
				icon = this.MARKER_ICON_SETTINGS;
				marker.setIcon(icon);
				// infoWindow.close();

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
