import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {PropertiesService} from '../properties/properties.service';

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
				private propertiesService: PropertiesService) {
	}

	ngOnInit() {
		this.options = {
			center: {lat: this.DEFAULT_LATITUDE, lng: this.DEFAULT_LONGITUDE},
			zoom: this.DEFAULT_ZOOM
		};
		this.overlays = [
			new google.maps.Marker({position: {lat: 36.879466, lng: 30.667648}, title: 'Konyaalti'}),
			new google.maps.Marker({position: {lat: 36.883707, lng: 30.689216}, title: 'Ataturk Park'}),
			new google.maps.Marker({position: {lat: 36.885233, lng: 30.702323}, title: 'Oldtown'}),
		];
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
		// ToDo: Show the markers
		console.log(propertiesResponse);
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
}
