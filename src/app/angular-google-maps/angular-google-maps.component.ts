import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
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
				public propertiesService: PropertiesService,
				private cdr: ChangeDetectorRef) {
		// workaround to activate change detection manually(bug in angular > 4.1.3), remove delay between constructor and ngOnInit hook
		setTimeout(() => this.setChanged(), 0);
	}

	setChanged() {
		this.cdr.markForCheck();
		this.cdr.detectChanges();
	}

	async ngOnInit() {
		const paramLatitude = this.route.snapshot.paramMap.get('latitude');
		const paramLongitude = this.route.snapshot.paramMap.get('longitude');
		const paramZoom = this.route.snapshot.paramMap.get('zoom');

		if (paramLatitude === undefined || paramLatitude === null || paramLongitude === undefined || paramLongitude == null) {
			// set google maps defaults
			const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(this.latitude, this.longitude);
			this.properties = propertiesResponse.properties;

			// set current position
			this.setCurrentPosition();
		} else {
			this.latitude = +paramLatitude;
			this.longitude = +paramLongitude;
			this.zoom = paramZoom ? +paramZoom : this.zoom;
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
		// workaround to activate change detection manually
		setTimeout(() => this.setChanged(), 0);
	}
}
