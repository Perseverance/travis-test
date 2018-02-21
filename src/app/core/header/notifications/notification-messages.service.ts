import { TranslateService } from '@ngx-translate/core';
import { notificationMessages } from './notificationMessages.model';
import { Injectable } from '@angular/core';
@Injectable()
export class NotificationMessagesService {
	public notificationTranslations: object;
	constructor(private translateService: TranslateService) { }

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
}
