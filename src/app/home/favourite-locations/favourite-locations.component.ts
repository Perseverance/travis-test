import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {GetFavouriteLocationResponse} from '../../properties/properties-responses';
import {PropertiesService} from '../../properties/properties.service';
import {Router} from '@angular/router';
import {NgxCarousel} from 'ngx-carousel';

@Component({
	selector: 'app-favourite-locations',
	templateUrl: './favourite-locations.component.html',
	styleUrls: ['./favourite-locations.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class FavouriteLocationsComponent implements OnInit {
	public favouriteLocations: GetFavouriteLocationResponse[];
	public topCities: Array<any>;
	public carouselTile: NgxCarousel;

	constructor(private propertiesService: PropertiesService,
				private router: Router) {
	}

	async ngOnInit() {
		this.carouselTile = {
			grid: {xs: 1, sm: 1, md: 4, lg: 4, all: 0},
			slide: 4,
			speed: 400,
			point: {
				visible: true,
				pointStyles: `
							  .ngxcarouselPoint {
								list-style-type: none;
								text-align: center;
								padding: 12px;
								margin: 0;
								white-space: nowrap;
								overflow: auto;
								position: absolute;
								width: 100%;
								left: 0;
								box-sizing: border-box;
							  }
							  .ngxcarouselPoint li {
								display: inline-block;
								cursor: pointer;
								border-radius: 999px;
								background: #DCF6FF;
								padding: 7px;
								margin: 0 3px;
								transition: .4s ease all;
							  }
							  .ngxcarouselPoint li.active {
								  background: #4CCAF7;
								  width: 10px;
							  }
							`
			},
			easing: 'ease'
		};
		this.favouriteLocations = await this.propertiesService.getFavouriteLocations();
		this.topCities = this.favouriteLocations;

	}

	cityItemClicked(location: GetFavouriteLocationResponse) {
		this.router.navigate(['map', {
			latitude: location.latitude,
			longitude: location.longitude,
			zoom: location.zoomLevel
		}]);
	}

}
