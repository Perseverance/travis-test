import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';
import {APIEndpointsService} from './apiendpoints.service';
import {ActivatedRoute, Router} from '@angular/router';
import {MessageService} from 'primeng/components/common/messageservice';
import {Subject} from 'rxjs/Subject';
import {NextObserver} from 'rxjs/Observer';
import {Subscription} from 'rxjs/Subscription';

declare const Pusher: any;

// ToDo: Refactor when we start using a real notification
export enum PUSHER_EVENTS_ENUM {
	DEAL_INVITATION = '1',
	DEAL_STATUS_CHANGED = '2',
	NEW_DOCUMENT_UPLOADED = '3',
	DOCUMENT_SIGNATURE_UPDATED = '4'
}

@Injectable()
export class PusherService {
	private pusher: any;
	private pusherChannel: any;
	private documentSignatureUpdatedSubject: Subject<any>;
	private DEFAULT_VALUE_TIMEOUT = 5000;

	constructor(private apiEndpointsService: APIEndpointsService,
				private route: ActivatedRoute,
				private router: Router,
				private messageService: MessageService) {
		this.documentSignatureUpdatedSubject = new Subject();
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
		channel.bind(PUSHER_EVENTS_ENUM.DEAL_INVITATION, (data) => {
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
		channel.bind(PUSHER_EVENTS_ENUM.DEAL_STATUS_CHANGED, (data) => {
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
		channel.bind(PUSHER_EVENTS_ENUM.NEW_DOCUMENT_UPLOADED, (data) => {
			this.messageService.add({
				severity: 'info',
				summary: 'A new document has been uploaded to one of your deals',
				detail: data.message
			});
		});

		// Event for downloadable signed document
		channel.bind(PUSHER_EVENTS_ENUM.DOCUMENT_SIGNATURE_UPDATED, (data) => {
			this.triggerDocumentSignatureUpdatedSubject(data);
		});
	}

	public subscribeToDocumentSignatureUpdatedSubject(observer: NextObserver<any>): Subscription {
		return this.documentSignatureUpdatedSubject.subscribe(observer);
	}

	public triggerDocumentSignatureUpdatedSubject(event: any) {
		return this.documentSignatureUpdatedSubject.next(event);
	}
}
