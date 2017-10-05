import {Component, ElementRef, EventEmitter, NgZone, OnInit, Output, ViewChild} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {FormBuilder, FormGroup} from '@angular/forms';

@Component({
	selector: 'app-property-search',
	templateUrl: './property-search.component.html',
	styleUrls: ['./property-search.component.scss']
})
export class PropertySearchComponent implements OnInit {
	private autoComplete: any;
	public properties: any;
	public googleSearchForm: FormGroup;

	@Output() onLocationFound = new EventEmitter<object>();

	@ViewChild('search')
	public searchElementRef: ElementRef;


	constructor(private mapsAPILoader: MapsAPILoader,
				private ngZone: NgZone,
				private formBuilder: FormBuilder) {
		this.googleSearchForm = this.formBuilder.group({
			searchControl: ['']
		});
	}

	async ngOnInit() {
		await this.loadPlacesAutoCompleteSearch();
	}

	async loadPlacesAutoCompleteSearch() {
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
				const autoCompleteService = new google.maps.places.AutocompleteService();
				await autoCompleteService.getPlacePredictions({
					'input': place.name,
					'offset': place.name.length
				}, (list, status) => this.firstPlacePredictionOnEnter(list, status));
				return;
			}
			const latitude = place.geometry.location.lat();
			const longitude = place.geometry.location.lng();
			this.onLocationFound.emit({latitude, longitude});
		});
	}

	private async firstPlacePredictionOnEnter(list: any, status: any) {
		const self = this;
		const dummyElement = document.createElement('div');
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			const placesService = new google.maps.places.PlacesService(dummyElement);
			await placesService.getDetails({
				placeId: list[0].place_id
			}, function detailsResult(detailsResult, placesServiceStatus) {
				if (placesServiceStatus === google.maps.places.PlacesServiceStatus.OK) {
					const latitude = detailsResult.geometry.location.lat();
					const longitude = detailsResult.geometry.location.lng();
					console.log(detailsResult.geometry.location.lng(), detailsResult.geometry.location.lat());
					self.onLocationFound.emit({latitude, longitude});
				}
			});
		}
	}

}
