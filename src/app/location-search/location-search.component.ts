import {
	Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild, Input,
	ApplicationRef
} from '@angular/core';
import { } from '@types/googlemaps';
import { FormBuilder } from '@angular/forms';
import { NavigationEnd, Router } from '@angular/router';
import { GoogleAnalyticsEventsService } from '../shared/google-analytics.service';

interface SearchLocation {
	latitude: number;
	longitude: number;
	locationAddress: string;
	locationName?: string;
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

	@Input() inputPlaceholder: string;
	@Input() resetAfterSearch = false;
	@Input() searchOnEnter = true;
	@Input() inputTheme = 'small';

	@Output() onLocationFound = new EventEmitter<SearchLocation>();

	@ViewChild('search')
	public searchElementRef: ElementRef;

	constructor(private ngZone: NgZone,
		private formBuilder: FormBuilder,
		private router: Router,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
			
		this.router.events.filter(event => event instanceof NavigationEnd).subscribe((event: NavigationEnd) => {
			if (event.url.startsWith('/map')) {
				// NOTICE: Fixes buggy angular not redrawing when there is google map in the view
				this.ngZone.run(() => {
				});
			}
		});
	}

	ngOnInit() {
		this.loadPlacesAutoCompleteSearch();
	}

	async loadPlacesAutoCompleteSearch() {
		this.autoComplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {});
		this.autoCompleteService = new google.maps.places.AutocompleteService();

		this.autoComplete.addListener('place_changed', () => this.placeChangedHandler(this.autoComplete));
	}

	private placeChangedHandler(autoComplete: any) {
		this.ngZone.run(() => {
			// get the place result
			const place: google.maps.places.PlaceResult = this.autoComplete.getPlace();
			// search by button
			if (place === undefined) {
				this.autoCompleteService.getQueryPredictions({ input: this.searchElementRef.nativeElement.value },
					(predictions, status) => this.displaySuggestions(predictions, status));
				return;
			}
			// verify result
			if (place.geometry === undefined || place.geometry === null) {
				this.autoCompleteService.getQueryPredictions({ input: place.name },
					(predictions, status) => this.displaySuggestions(predictions, status));
				return;
			}
			const latitude = place.geometry.location.lat();
			const longitude = place.geometry.location.lng();
			const locationAddress = place.formatted_address;
			const locationName = place.name;
			this.emitLocationFound({ latitude, longitude, locationAddress, locationName });
		});
		this.googleAnalyticsEventsService.emitEvent('page-search', 'search');
	}

	private displaySuggestions(predictions, displayStatus) {
		if (displayStatus !== google.maps.places.PlacesServiceStatus.OK) {
			return;
		}
		const self = this;
		const geocoder = new google.maps.Geocoder;
		geocoder.geocode({ placeId: predictions[0].place_id }, function (results, status) {
			if (status === google.maps.GeocoderStatus.OK) {
				if (results[0]) {
					const latitude = results[0].geometry.location.lat();
					const longitude = results[0].geometry.location.lng();
					const locationAddress = results[0].formatted_address;
					self.emitLocationFound({ latitude, longitude, locationAddress });
				}
			}
		});
	}

	private emitLocationFound(value: SearchLocation) {
		this.onLocationFound.emit(value);
		if (this.resetAfterSearch) {
			this.searchElementRef.nativeElement.value = '';
		}
	}

	public setAddress(address: string) {
		this.searchElementRef.nativeElement.value = address;
		this.searchButtonClicked();
	}

	public searchButtonClicked() {
		google.maps.event.trigger(this.autoComplete, 'place_changed');
	}

	public resetInput() {
		this.searchElementRef.nativeElement.value = null;
	}
}
