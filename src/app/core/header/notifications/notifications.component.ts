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

	constructor(private pusherService: PusherService) {
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
				"propertyId": "3784328432432",
				"timestamp": 1518613654,
				"actor": {
					"firstName": "Ivan",
					"lastName": "Ivanov",
					"imageAvatar": "path to the image avatar of the actor of the notification"
				}
			},
			{
				"notificationId": "rfdfsd1244312",
				"eventType": 2,
				"isSeen": true,
				"transactionToolRelatedInfo": {
					"deedId": "1231312312",
					"currentStatus": 3
				},
				"propertyId": "3784328432432",
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

	onShowNotifications() {

	}

	onReadNotification() {

	}

}
