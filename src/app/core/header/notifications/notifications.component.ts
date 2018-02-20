import { notificationMessages } from './notificationMessages.model';
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
		private notificationMessageService: NotificationMessagesService) { }

	ngOnInit() {
		this.notificationSubscription = this.pusherService.subscribeToNotificationsSubject({
			next: (data: any) => {
				this.notifications.push(JSON.parse(data.message));
				this.newNotifications += 1;
				this.onNewNotifications.emit(this.newNotifications);
				//console.log(JSON.parse(data.message));
			}
		});
		this.onNewNotifications.emit(this.newNotifications);
	}
	public notificationMessage(notificationType) {
		return this.notificationMessageService.returnMessage(notificationType);
	}

	private async goToRelatedEvent(notificationId, deedId, deedStatus) {
		this.router.navigate(['transaction-tool', deedId, this.notificationMessageService.returnDeedStatus(deedStatus)]);
		const result = await this.notificationMessageService.setNotificaitonSeen(notificationId);
	}

}
