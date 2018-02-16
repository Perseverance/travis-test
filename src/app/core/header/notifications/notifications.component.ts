import { Router } from '@angular/router';
import { NotificationMessagesService } from './notification-messages.service';
import { Subscription } from 'rxjs/Subscription';
import { PusherService } from './../../../shared/pusher.service';
import { Component, OnInit, EventEmitter, Output } from '@angular/core';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
	private notificationSubscription: Subscription;
	public notifications: any;
	@Output() onNewNotifications = new EventEmitter<boolean>();

	constructor(private router: Router, private pusherService: PusherService,
		private notificationMessageService: NotificationMessagesService) {
		// TO DO SERVICE TO LOAD THE DATA
		this.notifications = {
			"newNotifications": 2,
			"notifications": [{
				"notificationId": "rfdfsd1244312",
				"eventType": 1,
				"isSeen": false,
				"transactionToolRelatedInfo": {
					"deedId": "1231312312",
					"currentStatus": 3
				},
				"propertyId": "5a6cfebf49a7653fb8a29438",
				"timestamp": 1518613654,
				"actor": {
					"firstName": "Ivan",
					"lastName": "Ivanov",
					"imageAvatar": "path to the image avatar of the actor of the notification"
				}
			},
			{
				"notificationId": "rfdfsd1244312",
				"eventType": 0,
				"isSeen": true,
				"transactionToolRelatedInfo": {
					"deedId": "1231312312",
					"currentStatus": 3
				},
				"propertyId": "5a6cfebf49a7653fb8a29438",
				"timestamp": 1518613654,
				"actor": {
					"firstName": "Ognyan",
					"lastName": "Chikov",
					"imageAvatar": "path to the image avatar of the actor of the notification"
				}
			},
			{
				"notificationId": "rfdfsd1244312",
				"eventType": 0,
				"isSeen": true,
				"transactionToolRelatedInfo": {
					"deedId": "1231312312",
					"currentStatus": 3
				},
				"propertyId": "5a6cfebf49a7653fb8a29438",
				"timestamp": 1518613654,
				"actor": {
					"firstName": "Ognyan",
					"lastName": "Chikov",
					"imageAvatar": "path to the image avatar of the actor of the notification"
				}
			},
			{
				"notificationId": "rfdfsd1244312",
				"eventType": 0,
				"isSeen": true,
				"transactionToolRelatedInfo": {
					"deedId": "1231312312",
					"currentStatus": 3
				},
				"propertyId": "5a6cfebf49a7653fb8a29438",
				"timestamp": 1518613654,
				"actor": {
					"firstName": "Ognyan",
					"lastName": "Chikov",
					"imageAvatar": "path to the image avatar of the actor of the notification"
				}
			},
			{
				"notificationId": "rfdfsd1244312",
				"eventType": 0,
				"isSeen": true,
				"transactionToolRelatedInfo": {
					"deedId": "1231312312",
					"currentStatus": 3
				},
				"propertyId": "5a6cfebf49a7653fb8a29438",
				"timestamp": 1518613654,
				"actor": {
					"firstName": "Ognyan",
					"lastName": "Chikov",
					"imageAvatar": "path to the image avatar of the actor of the notification"
				}
			},
			{
				"notificationId": "rfdfsd1244312",
				"eventType": 0,
				"isSeen": true,
				"transactionToolRelatedInfo": {
					"deedId": "1231312312",
					"currentStatus": 3
				},
				"propertyId": "5a6cfebf49a7653fb8a29438",
				"timestamp": 1518613654,
				"actor": {
					"firstName": "Ognyan",
					"lastName": "Chikov",
					"imageAvatar": "path to the image avatar of the actor of the notification"
				}
			},
			{
				"notificationId": "rfdfsd1244312",
				"eventType": 0,
				"isSeen": true,
				"transactionToolRelatedInfo": {
					"deedId": "1231312312",
					"currentStatus": 3
				},
				"propertyId": "5a6cfebf49a7653fb8a29438",
				"timestamp": 1518613654,
				"actor": {
					"firstName": "Ognyan",
					"lastName": "Chikov",
					"imageAvatar": "path to the image avatar of the actor of the notification"
				}
			}]
		}
	}

	ngOnInit() {
		this.notificationSubscription = this.pusherService.subscribeToNotificationsSubject({
			next: (data: any) => {
				this.notifications.notifications.push(data);
				this.notifications.newNotifications += 1;
				this.onNewNotifications.emit(this.notifications);
			}
		});
		this.onNewNotifications.emit(this.notifications);
	}
	public notificationMessage(eventType) {
		return this.notificationMessageService.returnMessage(eventType, 'test');
	}

	onShowNotifications() {

	}

	onReadNotification() {

	}
	private goToRelatedEvent(propertyId: string) {
		this.router.navigate(['property', propertyId]);
	}

}
