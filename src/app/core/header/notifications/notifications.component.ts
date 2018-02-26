import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { notificationType } from './notification-types-messages.model';
import { Router, ActivatedRoute } from '@angular/router';
import { NotificationMessagesService } from './notification-messages.service';
import { Subscription } from 'rxjs/Subscription';
import { PusherService } from './../../../shared/pusher.service';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { Notification } from 'rxjs/Notification';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit, OnDestroy {
	private notificationSubscription: Subscription;
	public notificationsToShow = 5;
	@Output() onNewNotifications = new EventEmitter();
	@Input() notifications: any[];
	@Input() newNotifications: number;
	constructor(private router: Router, private pusherService: PusherService,
		private notificationMessageService: NotificationMessagesService,
		private route: ActivatedRoute) {
		this.notificationSubscription = this.pusherService.subscribeToNotificationsSubject({
			next: (data: any) => {
				if (this.notifications) {
					this.notifications.unshift(this.notificationMessageService.deSerializeData(data.message));
					this.newNotifications++;
					this.onNewNotifications.emit(this.newNotifications);
				}
			}
		});
		this.onNewNotifications.emit(this.newNotifications);
	}

	ngOnInit() {
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
				notification.isSeen = true;
				this.router.navigate(['transaction-tool', notification.details.deedId,
					this.notificationMessageService.returnDeedStatus(notification.details.deedStatus)]);
				await this.notificationMessageService.setNotificaitonSeen(notification.notificationId);
				break;
		}
	}
	private getIconClass(notification) {
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
				return 'fa fa-building-o';
		}
	}
	public loadMoreNotifications() {
		this.notificationsToShow += 5;
	}

	ngOnDestroy() {
		this.notificationSubscription.unsubscribe();
	}
	public get currentLenght() {
		return this.notificationsToShow;
	}
}
