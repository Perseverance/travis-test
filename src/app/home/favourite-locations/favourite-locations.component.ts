import {Component, OnInit} from '@angular/core';
import {GetFavouriteLocationResponse} from '../../properties/properties-responses';
import {PropertiesService} from '../../properties/properties.service';
import {Router} from '@angular/router';

@Component({
	selector: 'app-favourite-locations',
	templateUrl: './favourite-locations.component.html',
	styleUrls: ['./favourite-locations.component.scss']
})
export class FavouriteLocationsComponent implements OnInit {
	public favouriteLocations: GetFavouriteLocationResponse[];

	constructor(private propertiesService: PropertiesService,
				private router: Router) {
	}

	async ngOnInit() {
		this.favouriteLocations = await this.propertiesService.getFavouriteLocations();
	}

	cityItemClicked(location: GetFavouriteLocationResponse) {
		this.router.navigate(['map', {
			latitude: location.latitude,
			longitude: location.longitude,
			zoom: location.zoomLevel
		}]);
	}

}
