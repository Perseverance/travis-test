import { RedirectableComponent } from './../../shared/redirectable/redirectable.component';
import { GetPropertyResponse } from './../properties-responses';
import { AuthenticationService } from './../../authentication/authentication.service';
import { PropertiesService } from './../properties.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-property-details',
	templateUrl: './property-details.component.html',
	styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent extends RedirectableComponent implements OnInit, OnDestroy {

	public property: GetPropertyResponse;
	private idSubscription: Subscription;

	constructor(
		router: Router,
		private route: ActivatedRoute,
		private propertiesService: PropertiesService,
		private authService: AuthenticationService) {
		super(router);
	}

	async ngOnInit() {
		const self = this;
		const result = await self.authService.performAnonymousLogin(); // This + authService will be removed with the new wrapping route.
		const idObservable: Observable<string> = self.route.params.map(p => p.id);
		this.idSubscription = idObservable.subscribe(async function (propertyId) {
			self.property = await self.propertiesService.getProperty(propertyId);
		});

	}

	ngOnDestroy() {
		this.idSubscription.unsubscribe();
	}

}
