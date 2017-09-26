import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {FormControl} from '@angular/forms';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';

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

	@ViewChild('search')
	public searchElementRef: ElementRef;


	constructor(private mapsAPILoader: MapsAPILoader,
				private ngZone: NgZone) {
	}

	ngOnInit() {
		// set google maps defaults
		this.zoom = 12;
		this.latitude = 37.452961;
		this.longitude = -122.181725;

		// create search FormControl
		this.searchControl = new FormControl();

		// set current position
		this.setCurrentPosition();

		// load Places Autocomplete
		this.mapsAPILoader.load().then(() => {
			const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
				types: ['address']
			});
			autocomplete.addListener('place_changed', () => {
				this.ngZone.run(() => {
					// get the place result
					const place: google.maps.places.PlaceResult = autocomplete.getPlace();


					// verify result
					if (place.geometry === undefined || place.geometry === null) {
						return;
					}

					// set latitude, longitude and zoom
					this.latitude = place.geometry.location.lat();
					this.longitude = place.geometry.location.lng();
					this.formatted_address = place.formatted_address;
					console.log(this.formatted_address); // ToDo: remove logs after tests
					console.log(this.latitude);
					console.log(this.longitude);
					console.log(this.zoom);


				});
			});
		});
	}

	private setCurrentPosition() {
		if ('geolocation' in navigator) {
			navigator.geolocation.getCurrentPosition((position) => {
				this.latitude = position.coords.latitude;
				this.longitude = position.coords.longitude;
			});
		}
	}
}
