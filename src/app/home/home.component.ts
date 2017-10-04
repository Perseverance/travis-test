import {Component, ElementRef, NgZone, OnInit, ViewChild} from '@angular/core';
import {MapsAPILoader} from '@agm/core';
import {} from '@types/googlemaps';
import {FormBuilder, Validators, FormGroup} from '@angular/forms';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	private autoComplete: any;
	public properties: any;
	public googleSearchForm: FormGroup;


	@ViewChild('search')
	public searchElementRef: ElementRef;


	constructor(private mapsAPILoader: MapsAPILoader,
				private ngZone: NgZone,
				private formBuilder: FormBuilder) {
		this.googleSearchForm = this.formBuilder.group({
			searchControl: ['', [Validators.required]]
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
			} else {
				console.log('Selected from dropdown');
			}
		});
	}

	private async firstPlacePredictionOnEnter(list: any, status: any) {
		if (status === google.maps.places.PlacesServiceStatus.OK) {
			const placesService = new google.maps.places.PlacesService(document.createElement('div'));
			await placesService.getDetails({
				placeId: list[0].place_id
			}, function detailsResult(detailsResult, placesServiceStatus) {
				if (placesServiceStatus === google.maps.places.PlacesServiceStatus.OK) {
					console.log(detailsResult.geometry.location.lng(), detailsResult.geometry.location.lat());
				}
			});
		}
	}
}
