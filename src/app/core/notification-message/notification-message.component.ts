import { NotificationsService, DisplayableInfo } from './../../shared/notifications/notifications.service';
import { ErrorsService, DisplayableError } from './../../shared/errors/errors.service';
import { Component, OnInit } from '@angular/core';

export enum NotificationTypeEnum {
	ERROR = 'error',
	INFO = 'info',
	SUCCESS = 'success'
}

@Component({
	selector: 'app-notification-message',
	templateUrl: './notification-message.component.html',
	styleUrls: ['./notification-message.component.scss']
})
export class NotificationMessageComponent implements OnInit {

	private DEFAULT_ERROR_TIME = 5000;

	public title: string;
	public message: string;
	public isNotificationShown = false;
	public notificationType: NotificationTypeEnum;
	public timer: any;



	constructor(private errorsService: ErrorsService, private notificationsService: NotificationsService) { }

	ngOnInit() {
		const self = this;
		this.errorsService.subscribeToErrors({
			next: (error: DisplayableError) => {
				clearTimeout(this.timer);
				this.hideNotification();

				this.title = error.errorTitle;
				this.message = error.errorMessage;
				this.showError();

				this.timer = setTimeout(function () {
					self.hideNotification();
					self.timer = null;
				}, this.DEFAULT_ERROR_TIME);
			}
		});
		this.notificationsService.subscribeToInfo({
			next: (info: DisplayableInfo) => {
				clearTimeout(this.timer);
				this.hideNotification();

				this.title = info.title;
				this.message = info.message;
				this.showInfo();

				const timeout = (info.timeout) ? info.timeout : this.DEFAULT_ERROR_TIME;

				this.timer = setTimeout(function () {
					self.hideNotification();
					self.timer = null;
				}, timeout);
			}
		});

		this.notificationsService.subscribeToSuccess({
			next: (info: DisplayableInfo) => {
				clearTimeout(this.timer);
				this.hideNotification();

				this.title = info.title;
				this.message = info.message;
				this.showSuccess();

				const timeout = (info.timeout) ? info.timeout : this.DEFAULT_ERROR_TIME;

				this.timer = setTimeout(function () {
					self.hideNotification();
					self.timer = null;
				}, timeout);
			}
		});

	}

	private showError() {
		this.notificationType = NotificationTypeEnum.ERROR;
		this.isNotificationShown = true;
	}

	private showInfo() {
		this.notificationType = NotificationTypeEnum.INFO;
		this.isNotificationShown = true;
	}

	private showSuccess() {
		this.notificationType = NotificationTypeEnum.SUCCESS;
		this.isNotificationShown = true;
	}

	private hideNotification() {
		this.isNotificationShown = false;
	}

}
