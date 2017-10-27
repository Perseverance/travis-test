import {Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

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
	public DEFAULT_LATITUDE = 37.452961;
	public DEFAULT_LONGITUDE = -122.181725;
	public DEFAULT_ZOOM = 12;

	constructor(private route: ActivatedRoute) {
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
	}

	private setupParamsWatcher() {
		return this.route.params
			.subscribe(async params => {
				if (!params.latitude || !params.longitude) {
					console.log(params);
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
