import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { PropertiesService } from '../properties/properties.service';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs/Subject';
import { LatLngBounds } from '@agm/core';

@Component({
	selector: 'app-google-maps',
	templateUrl: './angular-google-maps.component.html',
	styleUrls: ['./angular-google-maps.component.scss']
})
export class AngularGoogleMapsComponent implements OnInit {
	private boundsChangedSubject: Subject<LatLngBounds>;
	public latitude = 37.452961;
	public longitude = -122.181725;
	public locationName = 'Menlo Park, CA, United States';
	public zoom = 12;
	public properties: any;
	private timer: any;
	private UPDATE_PROPERTIES_TIMEOUT = 200;

	constructor(private route: ActivatedRoute,
		public propertiesService: PropertiesService,
		private cdr: ChangeDetectorRef) {
		// workaround to activate change detection manually(bug in angular > 4.1.3), remove delay between constructor and ngOnInit hook
		setTimeout(() => this.setChanged(), 0);

		this.boundsChangedSubject = new Subject();
		this.boundsChangedSubject.subscribe(async (event) => {
			const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(
				event.getSouthWest().lat(),
				event.getNorthEast().lat(),
				event.getSouthWest().lng(),
				event.getNorthEast().lng());
			this.properties = propertiesResponse.properties;
		});
	}

	setChanged() {
		this.cdr.markForCheck();
		this.cdr.detectChanges();
	}

	async ngOnInit() {

		this.setupParamsWatcher();
	}

	private setupParamsWatcher() {
		return this.route.params
			.subscribe(async params => {
				if (!params.latitude || !params.longitude) {
					await this.moveToDefaultLocation();
					return;
				}
				this.moveToParamsLocation(+params.latitude, +params.longitude, params.locationName, params.zoom);
			});
	}

	private async moveToDefaultLocation() {
		this.setCurrentPosition();
	}

	private async moveToParamsLocation(lat: number, lon: number, locationName?: string, zoom?: number) {
		this.latitude = lat;
		this.longitude = lon;
		console.log(locationName);
		this.locationName = locationName !== 'undefined' ? locationName : '';
		this.zoom = zoom ? zoom : this.zoom;
	}

	private setCurrentPosition() {
		if (!('geolocation' in navigator)) {
			return;
		}

		navigator.geolocation.getCurrentPosition(async (position) => {
			this.latitude = position.coords.latitude;
			this.longitude = position.coords.longitude;
		});
	}

	async onLocationFoundHandler(latitude: number, longitude: number, zoom = this.zoom) {
		this.latitude = latitude;
		this.longitude = longitude;
		this.zoom = zoom;
		// workaround to activate change detection manually
		setTimeout(() => this.setChanged(), 0);
	}

	public async boundsChange(event) {
		clearTimeout(this.timer);
		this.timer = setTimeout(() => {
			this.boundsChangedSubject.next(event);
		}, this.UPDATE_PROPERTIES_TIMEOUT);
	}
}
