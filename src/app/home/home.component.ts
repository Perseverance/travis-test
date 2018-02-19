import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

declare function SmartBanner(param1: any): void;

@Component({
	selector: 'app-home',
	templateUrl: './home.component.html',
	styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

	public taiwan = false;

	constructor(private router: Router,
		private authService: AuthenticationService,
		private zone: NgZone) {
	}

	ngOnInit() {
		setTimeout(() => {
			this.taiwan = true;
		}, 7000); // TODO: DELETE!
		this.authService.refreshTokenOrLoginAnonym();
		const banner = new SmartBanner({
			// force: 'ios', // Uncomment for platform emulation
			daysHidden: 7, // days to hide banner after close button is clicked (defaults to 15)
			daysReminder: 30, // days to hide banner after "VIEW" button is clicked (defaults to 90)
			appStoreLanguage: 'us', // language code for the App Store (defaults to user's browser language)
			title: 'Propy',
			author: 'Propy Inc',
			button: 'View',
			store: {
				ios: 'In App Store'
			},
			price: {
				ios: 'FREE'
			},
			icon: '/assets/images/propy-app-image.jpg' // full path to icon image if not using website icon image
		});
	}

	onLocationFoundHandler(latitude: number, longitude: number, locationName: string) {
		this.router.navigate(['map', { latitude, longitude, locationName }]);
		// NOTICE: Fixes buggy angular not redrawing when there is google map in the view
		this.zone.run(() => { });
	}
}
