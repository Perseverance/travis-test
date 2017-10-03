import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

export class RedirectableComponent {

	constructor(protected router: Router) { }

	public get componentUrl(): string {
		return this.router.url;
	}

}
