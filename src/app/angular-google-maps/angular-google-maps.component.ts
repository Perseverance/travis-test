import {Component, OnInit} from '@angular/core';
import {PropertiesService} from '../properties/properties.service';
import {ActivatedRoute} from '@angular/router';

@Component({
	selector: 'app-google-maps',
	templateUrl: './angular-google-maps.component.html',
	styleUrls: ['./angular-google-maps.component.scss']
})
export class AngularGoogleMapsComponent implements OnInit {

	public latitude = 37.452961;
	public longitude = -122.181725;
	public zoom = 12;
	public formattedAddress: string;
	public properties: any;

	constructor(private route: ActivatedRoute,
				public propertiesService: PropertiesService) {
	}

	async ngOnInit() {
		const paramLatitude = this.route.snapshot.paramMap.get('latitude');
		const paramLongitude = this.route.snapshot.paramMap.get('longitude');

		if (paramLatitude === undefined || paramLatitude === null || paramLongitude === undefined || paramLongitude == null) {
			// set google maps defaults
			const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(this.latitude, this.longitude);
			this.properties = propertiesResponse.properties;

			// set current position
			this.setCurrentPosition();
		} else {
			this.latitude = +paramLatitude;
			this.longitude = +paramLongitude;
			const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(this.latitude, this.longitude);
			this.properties = propertiesResponse.properties;
		}
	}

	private setCurrentPosition() {
		if (!('geolocation' in navigator)) {
			return;
		}

		navigator.geolocation.getCurrentPosition(async (position) => {
			this.latitude = position.coords.latitude;
			this.longitude = position.coords.longitude;
			const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(this.latitude, this.longitude);
			this.properties = propertiesResponse.properties;
		});
	}

	async onLocationFoundHandler(latitude: number, longitude: number, zoom = this.zoom) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.zoom = zoom;
		const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(this.latitude, this.longitude);
		this.properties = propertiesResponse.properties;
	}
}
