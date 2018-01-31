import {Router} from '@angular/router';
import {PropertiesService} from './../../properties/properties.service';
import {NgxCarousel} from 'ngx-carousel';
import {Component, OnInit, ViewEncapsulation} from '@angular/core';

@Component({
	selector: 'app-featured-properties',
	templateUrl: './featured-properties.component.html',
	styleUrls: ['./featured-properties.component.scss'],
	encapsulation: ViewEncapsulation.None

})
export class FeaturedPropertiesComponent implements OnInit {
	public featureLocations;
	public showedLocations;
	public carouselTile: NgxCarousel;
	public hasDataLoaded = false;
	public isServiceWorking = true;


	constructor(private propertiesService: PropertiesService, private router: Router) {
	}

	async ngOnInit() {
		this.carouselTile = {
			grid: {xs: 1, sm: 2, md: 3, lg: 3, all: 0},
			speed: 1000,
			slide: 1,
			interval: 4000,
			point: {
				visible: true
			},
			easing: 'ease',
			loop: true
		};
		try {
			this.featureLocations = await this.propertiesService.getFeaturedProperties();
			this.showedLocations = this.featureLocations;
			this.hasDataLoaded = true;
		} catch (error) {
			this.isServiceWorking = false;
		}

	}

	public featuredPropertyClicked(location) {
		this.router.navigate(['property', location.id]);
	}
}
