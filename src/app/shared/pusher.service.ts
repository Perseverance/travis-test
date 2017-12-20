import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {APIEndpointsService} from './apiendpoints.service';
import {ActivatedRoute, Router} from '@angular/router';
import {Message} from 'primeng/primeng';

declare const Pusher: any;

@Injectable()
export class PusherService {
	pusher: any;
	pusherChannel: any;
	public globalMessages: Message[] = [];

	constructor(private apiEndpointsService: APIEndpointsService,
				private route: ActivatedRoute,
				private router: Router) {
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

	public bindEventsToChannel(channel: any) {
		// Event for Invitation
		channel.bind('1', (data) => {
			this.globalGrowlMessages = [{
				severity: 'info',
				summary: 'Deal Invitation',
				detail: 'Please check My Deals.'
			}];
		});

		// Event for status changed
		channel.bind('2', (data) => {
			if (!this.router.url.startsWith('/transaction-tool')) {
				this.globalGrowlMessages = [{
					severity: 'info',
					summary: 'Deal Status Changed',
					detail: 'Please check My Deals.'
				}];
				return;
			}
			this.router.navigate(['transaction-tool', data.message]);
		});
	}

	set globalGrowlMessages(value: any) {
		this.globalMessages = value;
	}

	get globalGrowlMessages(): any {
		return this.globalMessages;
	}
}
