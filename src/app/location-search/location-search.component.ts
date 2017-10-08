import {Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {FormBuilder} from '@angular/forms';

interface SearchLocation {
	latitude: number;
	longitude: number;
	locationAddress: string;
	zoom?: number;
}

@Component({
	selector: 'app-location-search',
	templateUrl: './location-search.component.html',
	styleUrls: ['./location-search.component.scss']
})
export class LocationSearchComponent implements OnInit {
	private autoComplete: any;
	private autoCompleteService: any;
	public properties: any;

	@Output() onLocationFound = new EventEmitter<SearchLocation>();

	@ViewChild('search')
	public searchElementRef: ElementRef;


	constructor(private mapsAPILoader: MapsAPILoader,
				private ngZone: NgZone,
				private formBuilder: FormBuilder) {
	}

	async ngOnInit() {
		await this.loadPlacesAutoCompleteSearch();
	}

	async loadPlacesAutoCompleteSearch() {
		await this.mapsAPILoader.load();
		this.autoComplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
		this.autoCompleteService = new google.maps.places.AutocompleteService();

		this.autoComplete.addListener('place_changed', () => this.placeChangedHandler(this.autoComplete));
	}

	private placeChangedHandler(autoComplete: any) {
		this.ngZone.run(() => {
			// get the place result
			const place: google.maps.places.PlaceResult = this.autoComplete.getPlace();
			// verify result
			if (place.geometry === undefined || place.geometry === null) {
				this.autoCompleteService.getQueryPredictions({input: place.name},
					(predictions, status) => this.displaySuggestions(predictions, status));
				return;
			}
			const latitude = place.geometry.location.lat();
			const longitude = place.geometry.location.lng();
			const locationAddress = place.formatted_address;
			this.onLocationFound.emit({latitude, longitude, locationAddress});
		});
	}

	private displaySuggestions(predictions, status) {
		if (status !== google.maps.places.PlacesServiceStatus.OK) {
			return;
		}
		const self = this;
		const geocoder = new google.maps.Geocoder;
		geocoder.geocode({'placeId': predictions[0].place_id}, function (results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					const latitude = results[0].geometry.location.lat();
					const longitude = results[0].geometry.location.lng();
					const locationAddress = results[0].formatted_address;
					self.onLocationFound.emit({latitude, longitude, locationAddress});
				}
			}
		});
	}
}
