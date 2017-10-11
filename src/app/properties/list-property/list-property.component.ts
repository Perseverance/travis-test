import { NotificationsService } from './../../shared/notifications/notifications.service';
import { AuthenticationService } from './../../authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-list-property',
	templateUrl: './list-property.component.html',
	styleUrls: ['./list-property.component.scss']
})
export class ListPropertyComponent extends ErrorsDecoratableComponent implements OnInit {

	public isUserAnonymous: boolean;
	public hasLoaded: boolean;

	constructor(errorsService: ErrorsService,
		translateService: TranslateService,
		private authService: AuthenticationService,
		private notificationService: NotificationsService) {
		super(errorsService, translateService);
	}

	async ngOnInit() {
		this.notificationService.pushInfo({ title: 'Loading...', message: '', time: (new Date().getTime()), timeout: 15000 });
		const result = await this.authService.isUserAnyonymous();
		this.isUserAnonymous = result;
		this.hasLoaded = true;
		this.notificationService.pushSuccess({ title: 'Account Loaded...', message: '', time: (new Date().getTime()), timeout: 1500 });
	}

}
