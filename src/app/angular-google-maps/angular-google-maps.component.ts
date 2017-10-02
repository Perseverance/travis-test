import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {AuthenticationService} from '../authentication/authentication.service';
import {PropertiesService} from '../properties/properties.service';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';
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
	private autoComplete: any;
	public properties: any;
	public googleSearchForm: FormGroup;


	@ViewChild('search')
	public searchElementRef: ElementRef;


	constructor(private mapsAPILoader: MapsAPILoader,
				private ngZone: NgZone,
				public propertiesService: PropertiesService,
				private formBuilder: FormBuilder,
				private translate: TranslateService) {
		this.googleSearchForm = this.formBuilder.group({
			searchControl: ['', [Validators.required]]
		});
	}

	async ngOnInit() {
		// set google maps defaults
		const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(this.latitude, this.longitude);
		this.properties = propertiesResponse.properties;

		// set current position
		this.setCurrentPosition();

		// load Places Autocomplete
		await this.loadPlacesAutocompleteSearch();
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

	async loadPlacesAutocompleteSearch() {
		await this.mapsAPILoader.load();
		this.autoComplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
			types: ['(regions)']
		});
		this.autoComplete.addListener('place_changed', () => this.placeChangedHandler(this.autoComplete));
	}

	private placeChangedHandler(autoComplete: any) {
		this.ngZone.run(async () => {
			// get the place result
			const place: google.maps.places.PlaceResult = this.autoComplete.getPlace();
			// verify result
			if (place.geometry === undefined || place.geometry === null) {
				return;
			}

			// set latitude, longitude and zoom
			this.latitude = place.geometry.location.lat();
			this.longitude = place.geometry.location.lng();
			this.formattedAddress = place.formatted_address;
			const propertiesResponse = await this.propertiesService.getPropertiesInRectangle(this.latitude, this.longitude);
			this.properties = propertiesResponse.properties;
		});
	}
}
