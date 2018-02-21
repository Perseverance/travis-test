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
	public iconClass;
	@Output() onNewNotifications = new EventEmitter();
	@Input() notifications: any[];
	@Input() newNotifications: number;
	constructor(private router: Router, private pusherService: PusherService,
		private notificationMessageService: NotificationMessagesService,
		private route: ActivatedRoute) { }

	ngOnInit() {
		this.notificationSubscription = this.pusherService.subscribeToNotificationsSubject({
			next: (data: any) => {
				// TO DO when backend is fixed and the pusher send only one notification!
				// this.notifications.push(this.notificationMessageService.deSerializeData(data.message));
				// this.newNotifications++;
				// this.onNewNotifications.emit(this.newNotifications);
				//console.log(this.notificationMessageService.deSerializeData(data.message));
				//console.log(data);
			}
		});
		this.onNewNotifications.emit(this.newNotifications);
	}
	public notificationMessage(notificationType) {
		return this.notificationMessageService.returnMessage(notificationType);
	}

	private async goToRelatedEvent(notification) {
		switch (this.notificationMessageService.returnNotificationType(notification.details.deedStatus)) {
			// TO DO add another case type here when we implement new notification types
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
				this.iconClass = 'fa fa-building-o';
				notification.isSeen = true;
				this.router.navigate(['transaction-tool', notification.details.deedId,
					this.notificationMessageService.returnDeedStatus(notification.details.deedStatus)]);
				await this.notificationMessageService.setNotificaitonSeen(notification.notificationId);
				break;
		}


		// this.router.navigate(['transaction-tool', deedId, this.notificationMessageService.returnDeedStatus(deedStatus)]);
		// const result = await this.notificationMessageService.setNotificaitonSeen(notificationId);
		//notification.notificationId, notification.deedInfo.deedId, notification.deedInfo.deedStatus
	}

}
