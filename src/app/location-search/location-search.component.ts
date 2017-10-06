import { Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { } from '@types/googlemaps';
import { FormBuilder, FormGroup } from '@angular/forms';

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
	private placesService: any;
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
		// this.autoCompleteService = new google.maps.places.AutocompleteService();
		// const dummyElement = document.createElement('div');
		// this.placesService = new google.maps.places.PlacesService(dummyElement);

		this.autoComplete.addListener('place_changed', () => this.placeChangedHandler(this.autoComplete));
	}

	private placeChangedHandler(autoComplete: any) {
		this.ngZone.run(() => {
			// get the place result
			const place: google.maps.places.PlaceResult = this.autoComplete.getPlace();
			// verify result
			if (place.geometry === undefined || place.geometry === null) {
				// ToDo: First result selected on enter
				// this.autoCompleteService.getPlacePredictions({
				// 	'input': place.name,
				// 	'offset': place.name.length
				// }, (list, status) => this.firstPlacePredictionOnEnter(list, status));
				return;
			}
			const latitude = place.geometry.location.lat();
			const longitude = place.geometry.location.lng();
			const locationAddress = place.formatted_address;
			this.onLocationFound.emit({ latitude, longitude, locationAddress });
		});
	}

	private firstPlacePredictionOnEnter(list: any, status: any) {
		const self = this;
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			this.placesService.getDetails({
				placeId: list[0].place_id
			}, function detailsResult(detailsResult, placesServiceStatus) {
				if (placesServiceStatus === google.maps.places.PlacesServiceStatus.OK) {
					const latitude = detailsResult.geometry.location.lat();
					const longitude = detailsResult.geometry.location.lng();
					const locationAddress = detailsResult.formatted_address;
					self.onLocationFound.emit({ latitude, longitude, locationAddress });
				}
			});
		}
	}

}
