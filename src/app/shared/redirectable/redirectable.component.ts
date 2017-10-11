import { Router } from '@angular/router';

export class RedirectableComponent {

	constructor(protected router: Router, protected skippedRoutes: Array<string> = [], protected defaultRoute: string = '') { }

	public get componentUrl(): string {
		let routeUrl = this.router.url;
		const questionIndex = routeUrl.indexOf('?');
		if (questionIndex > 0) {
			routeUrl = routeUrl.substring(0, questionIndex);
		}
		if (this.skippedRoutes.includes(routeUrl)) {
			return this.defaultRoute;
		}
		return routeUrl;
	}

}
