import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

declare let ga: Function;
@Injectable()
export class GoogleAnalyticsEventsService {
	eventLabel;
	constructor(public router: Router) {
		this.setupGoogleAnalytics();
	}
	private setupGoogleAnalytics() {
		(function (i, s, o, g, r, a, m) {
			i['GoogleAnalyticsObject'] = r;
			i[r] = i[r] || function () {
				(i[r].q = i[r].q || []).push(arguments);
			}, i[r].l = 1 * ((new Date()) as any);
			a = s.createElement(o),
				m = s.getElementsByTagName(o)[0];
			a.async = 1;
			a.src = g;
			m.parentNode.insertBefore(a, m);
		})(window, document, 'script', 'https://www.google-analytics.com/analytics.js', 'ga');

		ga('create', environment.googleAnalyticsId, 'auto'); // <- add the UA-ID from your tracking code
		// <- remove the last line like me
		this.router.events.subscribe(event => {
			if (event instanceof NavigationEnd) {
				this.eventLabel = event.urlAfterRedirects;
				this.setPageEvent(event);
			}
		});
	}
	public setPageEvent(event) {
		ga('set', 'page', event.urlAfterRedirects);
		ga('send', 'pageview');
	}
	public setPageViewEvent(
		eventCategory: string,
		eventAction: string) {
		ga('send', 'event', {
			eventCategory: eventCategory,
			eventAction: eventAction,
			eventLabel: this.eventLabel,
		});
	}
}