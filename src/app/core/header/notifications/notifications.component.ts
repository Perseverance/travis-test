import { notificationMessages } from './notificationMessages.model';
import { Router, ActivatedRoute } from '@angular/router';
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
		private notificationMessageService: NotificationMessagesService,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.notificationSubscription = this.pusherService.subscribeToNotificationsSubject({
			next: (data: any) => {
				this.notifications.push(this.notificationMessageService.deSerializeData(data.message));
				this.newNotifications++;
				this.onNewNotifications.emit(this.newNotifications);
				console.log(this.notificationMessageService.deSerializeData(data.message));
			}
		});
		this.onNewNotifications.emit(this.newNotifications);
	}
	public notificationMessage(notificationType) {
		return this.notificationMessageService.returnMessage(notificationType);
	}

	private async goToRelatedEvent(notification) {
		switch (this.notificationMessageService.returnNotificationType(notification.deedInfo.deedStatus)) {
			case 'reserved':
			case 'invited':
			case 'accepted':
			case 'move-to-next-step':
			case 'new-document-uploaded':
			case 'requires-signature':
			case 'signed':
			case 'action':
			case 'payment':
			case 'transfer':
				notification.isSeen = true;
				this.router.navigate(['transaction-tool', notification.deedInfo.deedId,
					this.notificationMessageService.returnDeedStatus(notification.deedInfo.deedStatus)]);
				await this.notificationMessageService.setNotificaitonSeen(notification.notificationId);
				break;
		}


		// this.router.navigate(['transaction-tool', deedId, this.notificationMessageService.returnDeedStatus(deedStatus)]);
		// const result = await this.notificationMessageService.setNotificaitonSeen(notificationId);
		//notification.notificationId, notification.deedInfo.deedId, notification.deedInfo.deedStatus
	}

}
