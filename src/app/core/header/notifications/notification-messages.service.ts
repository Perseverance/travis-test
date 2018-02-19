import { APIEndpointsService } from './../../../shared/apiendpoints.service';
import { RestClientService } from './../../../shared/rest-client.service';
import { TranslateService } from '@ngx-translate/core';
import { notificationMessages } from './notificationMessages.model';
import { Injectable } from '@angular/core';
@Injectable()
export class NotificationMessagesService {
	public notificationTranslations: object;
	constructor(private translateService: TranslateService,
		public restClient: RestClientService,
		public apiEndpoints: APIEndpointsService) { }

	public returnMessage(eventType: number, parameter: any) {
		this.translateService.stream([
			'notifications.reserved',
			'notifications.invited',

		]).subscribe((translations) => {
			this.notificationTranslations = {
				'reserved': translations['notifications.reserved'],
				'invited': translations['notifications.invited']
			};

		});
		return this.notificationTranslations[notificationMessages[eventType]];
	}
	public async checkedNotifications(): Promise<any> {
		const result = await this.restClient.get(this.apiEndpoints.INTERNAL_ENDPOINTS.CHECKED_NOTIFICATIONS, {});
	}

	public setNotificaitonSeen() {

	}

}
