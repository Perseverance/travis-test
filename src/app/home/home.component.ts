import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';
import {PropertiesService} from '../properties/properties.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
	public favouriteLocations: object;

	constructor(private router: Router,
				private authService: AuthenticationService,
				private propertiesService: PropertiesService) {
	}

	async ngOnInit() {
		this.favouriteLocations = await this.propertiesService.getFavouriteLocations();
		this.authService.refreshTokenOrLoginAnonym();
	}

	onLocationFoundHandler(latitude: number, longitude: number, zoom: number) {
		this.router.navigate(['map', {latitude: latitude, longitude: longitude}]);
	}
}
