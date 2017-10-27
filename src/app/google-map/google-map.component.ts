import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PropertiesService} from '../properties/properties.service';
import {GetPropertiesResponse} from '../properties/properties-responses';

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
	public DEFAULT_LATITUDE = 37.452961;
	public DEFAULT_LONGITUDE = -122.181725;
	public DEFAULT_ZOOM = 12;

	constructor(private route: ActivatedRoute,
				private propertiesService: PropertiesService,
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
			this.overlays.push(new google.maps.Marker({position: {lat: property.latitude, lng: property.longitude}}));
		}
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

	private setChanged() {
		this.cdr.markForCheck();
		this.cdr.detectChanges();
	}
}
