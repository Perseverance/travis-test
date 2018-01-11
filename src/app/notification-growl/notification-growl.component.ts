import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';

@Component({
	selector: 'app-notification-growl',
	templateUrl: './notification-growl.component.html',
	styleUrls: ['./notification-growl.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NotificationGrowlComponent implements OnInit {

	constructor(private router: Router,
				private messageService: MessageService) {
	}

	ngOnInit() {
	}

	public growlNotificationClicked(event) {
		if (!event.message.detail) {
			return;
		}
		this.router.navigate(['transaction-tool', event.message.detail]);
		this.messageService.clear();
	}
}
