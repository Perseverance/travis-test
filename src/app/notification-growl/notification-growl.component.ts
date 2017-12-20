import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PusherService} from '../shared/pusher.service';

@Component({
	selector: 'app-notification-growl',
	templateUrl: './notification-growl.component.html',
	styleUrls: ['./notification-growl.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NotificationGrowlComponent implements OnInit {

	constructor(public pusherService: PusherService) {
	}

	ngOnInit() {
	}

}
