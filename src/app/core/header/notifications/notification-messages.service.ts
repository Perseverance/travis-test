import { APIEndpointsService } from './../../../shared/apiendpoints.service';
import { RestClientService } from './../../../shared/rest-client.service';
import { TranslateService } from '@ngx-translate/core';
import { notificationType } from './notification-types-messages.model';
import { transactionToolSteps } from './notification-types-messages.model';
import { Injectable } from '@angular/core';
@Injectable()
export class NotificationMessagesService {
	public notificationTranslations: object;
	constructor(private translateService: TranslateService,
		public restClient: RestClientService,
		public apiEndpoints: APIEndpointsService) { }

	public returnMessage(eventType: number, parameter?: any) {
		this.translateService.stream([
			'notifications.reserved',
			'notifications.invited',

		]).subscribe((translations) => {
			this.notificationTranslations = {
				'reserved': translations['notifications.reserved'],
				'invited': translations['notifications.invited']
			};

		});
		return this.notificationTranslations[notificationType[eventType]];
	}
	public returnDeedStatus(deedStatus) {
		return transactionToolSteps[deedStatus];
	}
	public returnNotificationType(type) {
		return notificationType[type];
	}
	public async checkedNotifications(): Promise<any> {
		const result = await this.restClient.getWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.CHECKED_NOTIFICATIONS, {});
		return result;
	}

	public async setNotificaitonSeen(id) {
		const params = {
			id,
		};
		const result = await this.restClient.postWithAccessToken(this.apiEndpoints.INTERNAL_ENDPOINTS.SEEN_NOTIFICATION, {}, { params });
		return result;
	}

	public deSerializeData(data) {
		return JSON.parse(data);
	}

}
