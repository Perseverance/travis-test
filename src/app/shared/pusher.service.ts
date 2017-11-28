import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {APIEndpointsService} from './apiendpoints.service';

declare const Pusher: any;

@Injectable()
export class PusherService {
	pusher: any;
	pusherChannel: any;

	constructor(private apiEndpointsService: APIEndpointsService) {
	}

	public initializePusher(accessToken: string, userId: string): void {
		this.pusher = new Pusher(environment.pusher.key, {
			authEndpoint: this.apiEndpointsService.INTERNAL_ENDPOINTS.PUSHER_AUTH_ENDPOINT,
			auth: {
				headers: {
					'Authentication': `Bearer ${accessToken}`
				}
			},
			cluster: environment.pusher.cluster,
			encrypted: true
		});

		this.pusherChannel = this.pusher.subscribe(`private-${userId}`);
		this.bindEventsToChannel(this.pusherChannel);
	}

	public bindEventsToChannel(channel: any) {
		channel.bind('my-event', (data) => {
			console.log(data);
		});
	}
}
