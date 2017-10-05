import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export class RedirectableComponent {

	constructor(protected router: Router, protected skippedRoutes: Array<string> = [], protected defaultRoute: string = '') { }

	public get componentUrl(): string {
		const routeUrl = this.router.url;
		if (this.skippedRoutes.includes(routeUrl)) {
			return this.defaultRoute;
		}
		return routeUrl;
	}

}
