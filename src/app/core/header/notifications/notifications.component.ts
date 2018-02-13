import { Subscription } from 'rxjs/Subscription';
import { PusherService } from './../../../shared/pusher.service';
import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-notifications',
	templateUrl: './notifications.component.html',
	styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {
	private notificationSubscription: Subscription;

	constructor(private pusherService: PusherService) { }

	ngOnInit() {

		this.notificationSubscription = this.pusherService.subscribeToNotificationsSubject({
			next: async (data: any) => {
				console.log(data);
			}
		});
	}

}
