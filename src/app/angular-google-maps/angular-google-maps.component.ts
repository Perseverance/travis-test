import {Component, OnInit} from '@angular/core';
import {PropertiesService} from '../properties/properties.service';
import {TranslateService} from '@ngx-translate/core';


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

	constructor(public propertiesService: PropertiesService,
				public translate: TranslateService) {
	}

	async ngOnInit() {
		// set google maps defaults
		const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(this.latitude, this.longitude);
		this.properties = propertiesResponse.properties;

		// set current position
		this.setCurrentPosition();
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
}
