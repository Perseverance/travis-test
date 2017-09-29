import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {AuthenticationService} from '../authentication/authentication.service';
import {AngularGoogleMapsService} from './angular-google-maps.service';

@Component({
	selector: 'app-google-maps',
	templateUrl: './angular-google-maps.component.html',
	styleUrls: ['./angular-google-maps.component.scss']
})
export class AngularGoogleMapsComponent implements OnInit {

	public latitude: number;
	public longitude: number;
	public searchControl: FormControl;
	public zoom: number;
	public formatted_address: string;
	private autoComplete: any;
	public propertiesInRectangle: any;

	@ViewChild('search')
	public searchElementRef: ElementRef;


	constructor(private mapsAPILoader: MapsAPILoader,
				private ngZone: NgZone,
				private authService: AuthenticationService,
				public googleMapsService: AngularGoogleMapsService) {
	}

	ngOnInit() {
		if (this.authService.hasUserLoggedIn) {
			this.authService.refreshStoredAccessToken(true);
		} else {
			this.authService.performAnonymousLogin();
		}

		// set google maps defaults
		this.zoom = 12;
		this.latitude = 37.452961;
		this.longitude = -122.181725;
		this.propertiesInRectangle = this.googleMapsService.getPropertiesInRectangle(this.latitude, this.longitude);

		// create search FormControl
		this.searchControl = new FormControl();

		// set current position
		this.setCurrentPosition();

		// load Places Autocomplete
		this.loadPlacesAutocompleteSearch();
	}

	private setCurrentPosition() {
		if (!('geolocation' in navigator)) {
			return;
		}

		navigator.geolocation.getCurrentPosition((position) => {
			this.latitude = position.coords.latitude;
			this.longitude = position.coords.longitude;
			this.propertiesInRectangle = this.googleMapsService.getPropertiesInRectangle(this.latitude, this.longitude);
		});
	}

	async loadPlacesAutocompleteSearch() {
		await this.mapsAPILoader.load();
		this.autoComplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
			types: ['(regions)']
		});
		this.autoComplete.addListener('place_changed', () => this.placeChangedHandler(this.autoComplete));
	}

	private placeChangedHandler(autoComplete: any) {
		this.ngZone.run(() => {
			// get the place result
			const place: google.maps.places.PlaceResult = this.autoComplete.getPlace();


			// verify result
			if (place.geometry === undefined || place.geometry === null) {
				return;
			}

			// set latitude, longitude and zoom
			this.latitude = place.geometry.location.lat();
			this.longitude = place.geometry.location.lng();
			this.formatted_address = place.formatted_address;
			this.propertiesInRectangle = this.googleMapsService.getPropertiesInRectangle(this.latitude, this.longitude);
		});
	}
}
