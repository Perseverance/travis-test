import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {APIEndpointsService} from './apiendpoints.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {Subject} from 'rxjs/Subject';
import {NextObserver} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';

declare const Pusher: any;

@Injectable()
export class PusherService {
	private pusher: any;
	private pusherChannel: any;
	private downloadableDeedDocumentSubject: Subject<any>;
	private DEFAULT_VALUE_TIMEOUT = 5000;

	constructor(private apiEndpointsService: APIEndpointsService,
				private route: ActivatedRoute,
				private router: Router,
				private messageService: MessageService) {
		this.downloadableDeedDocumentSubject = new Subject();
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

		// Event for downloadable signed document
		channel.bind('4', (data) => {
			this.triggerDownloadableSubject(data);
		});
	}

	public subscribeToDownloadableSubject(observer: NextObserver<any>): Subscription {
		return this.downloadableDeedDocumentSubject.subscribe(observer);
	}

	public triggerDownloadableSubject(event: any) {
		return this.downloadableDeedDocumentSubject.next(event);
	}
}
