import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from './authentication/authentication.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
	title = 'app';

	constructor(private authService: AuthenticationService) {
	}

	async ngOnInit() {

		if (this.authService.hasUserLoggedIn) {
			await this.authService.refreshStoredAccessToken();
		} else {
			await this.authService.performAnonymousLogin();
		}
	}
}
