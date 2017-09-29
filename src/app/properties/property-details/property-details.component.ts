import { AuthenticationService } from './../../authentication/authentication.service';
import { PropertiesService } from './../properties.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';

@Component({
	selector: 'app-property-details',
	templateUrl: './property-details.component.html',
	styleUrls: ['./property-details.component.scss']
})
export class PropertyDetailsComponent implements OnInit, OnDestroy {

	public property;
	private idSubscription: Subscription;

	constructor(private route: ActivatedRoute, private propertiesService: PropertiesService, private authService: AuthenticationService) { }

	async ngOnInit() {
		const self = this;
		const result = await self.authService.performAnonymousLogin(); // This + authService will be removed with the new wrapping route.
		const idObservable: Observable<string> = self.route.params.map(p => p.id);
		this.idSubscription = idObservable.subscribe(async function (propertyId) {
			const res = await self.propertiesService.getProperty(propertyId);
		});
	}

	ngOnDestroy() {
		this.idSubscription.unsubscribe();
	}

}
