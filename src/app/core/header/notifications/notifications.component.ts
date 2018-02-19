import { Router } from '@angular/router';
import { NotificationMessagesService } from './notification-messages.service';
import { Subscription } from 'rxjs/Subscription';
import { PusherService } from './../../../shared/pusher.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
	private notificationSubscription: Subscription;
	@Output() onNewNotifications = new EventEmitter();
	@Input() notifications: any[];
	@Input() newNotifications: number;
	constructor(private router: Router, private pusherService: PusherService,
		private notificationMessageService: NotificationMessagesService) {
		// TO DO SERVICE TO LOAD THE DATA
	}

	ngOnInit() {
		this.notificationSubscription = this.pusherService.subscribeToNotificationsSubject({
			next: (data: any) => {
				this.notifications.push(data);
				this.newNotifications += 1;
				this.onNewNotifications.emit(this.newNotifications);
			}
		});
		this.onNewNotifications.emit(this.newNotifications);
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
