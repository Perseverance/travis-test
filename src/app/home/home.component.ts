import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	constructor(private router: Router,
				private authService: AuthenticationService) {
	}

	ngOnInit() {
		if (this.authService.hasUserLoggedIn) {
			this.authService.refreshStoredAccessToken();
		} else {
			this.authService.performAnonymousLogin();
		}
	}

	onLocationFoundHandler(latitude: number, longitude: number, zoom: number) {
		this.router.navigate(['map', {latitude: latitude, longitude: longitude}]);
	}
}
