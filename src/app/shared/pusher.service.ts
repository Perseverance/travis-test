import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {APIEndpointsService} from './apiendpoints.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';

declare const Pusher: any;

@Injectable()
export class PusherService {
	pusher: any;
	pusherChannel: any;
	private DEFAULT_VALUE_TIMEOUT = 5000;

	constructor(private apiEndpointsService: APIEndpointsService,
				private route: ActivatedRoute,
				private router: Router,
				private messageService: MessageService) {
	}

	public initializePusher(accessToken: string, userId: string): void {
		this.pusher = new Pusher(environment.pusher.key, {
			authEndpoint: `${environment.apiUrl}${this.apiEndpointsService.INTERNAL_ENDPOINTS.PUSHER_AUTH_ENDPOINT}`,
			auth: {
				headers: {
					'Authentication': `Bearer ${accessToken}`
				}
			},
			cluster: environment.pusher.cluster,
			encrypted: true
		});

		this.pusherChannel = this.pusher.subscribe(`${userId}_private`);
		this.bindEventsToChannel(this.pusherChannel);
	}

	public unsubscribePusherChannel(userId: string): void {
		this.pusher.unsubscribe(`${userId}_private`);
	}

	public bindEventsToChannel(channel: any) {

		// Event for Invitation
		channel.bind('1', (data) => {
			this.messageService.add({
				severity: 'info',
				summary: 'Deal Invitation. Please check My Deals.',
				detail: ''
			});
			const self = this;
			setTimeout(function () {
				self.messageService.clear();
			}, this.DEFAULT_VALUE_TIMEOUT);
		});

		// Event for status changed
		channel.bind('2', (data) => {
			if (!this.router.url.startsWith('/transaction-tool')) {
				this.messageService.add({
					severity: 'info',
					summary: `Deal Status Changed. Please check My Deals.`,
					detail: ''
				});
				const self = this;
				setTimeout(function () {
					self.messageService.clear();
				}, this.DEFAULT_VALUE_TIMEOUT);
				return;
			}
			const deedId = (this.router.url.split('/'))[2];
			if (deedId !== data.message) {
				return;
			}
			this.router.navigate(['transaction-tool', data.message]);
		});

		// Event for new document uploaded
		channel.bind('3', (data) => {
			this.messageService.add({
				severity: 'info',
				summary: 'A new document has been uploaded to one of your deals',
				detail: data.message
			});
		});
	}
}
