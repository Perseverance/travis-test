import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {PropertiesService} from '../properties/properties.service';
import {ActivatedRoute} from '@angular/router';
import {NextObserver} from 'rxjs/Observer';
import {Subject} from 'rxjs/Subject';
import {async} from 'q';
import {LatLngBounds} from '@agm/core';

@Component({
	selector: 'app-google-maps',
	templateUrl: './angular-google-maps.component.html',
	styleUrls: ['./angular-google-maps.component.scss']
})
export class AngularGoogleMapsComponent implements OnInit {
	private boundsChangedSubject: Subject<LatLngBounds>;
	public latitude = 37.452961;
	public longitude = -122.181725;
	public zoom = 12;
	public properties: any;
	private timer: any;
	private UPDATE_PROPERTIES_TIMEOUT = 400;

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
		const paramLatitude = this.route.snapshot.paramMap.get('latitude');
		const paramLongitude = this.route.snapshot.paramMap.get('longitude');
		const paramZoom = this.route.snapshot.paramMap.get('zoom');

		if (paramLatitude === undefined || paramLatitude === null || paramLongitude === undefined || paramLongitude == null) {
			// set current position
			this.setCurrentPosition();
		} else {
			this.latitude = +paramLatitude;
			this.longitude = +paramLongitude;
			this.zoom = paramZoom ? +paramZoom : this.zoom;
		}
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
