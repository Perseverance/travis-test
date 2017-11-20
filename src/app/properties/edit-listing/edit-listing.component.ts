import { LIST_PROPERTY_MODES, ListPropertyComponent } from './../list-property/list-property.component';
import { RedirectableComponent } from './../../shared/redirectable/redirectable.component';
import { PropertiesService } from './../properties.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';
import { Component, OnInit, OnDestroy, NgZone, ViewChild } from '@angular/core';

@Component({
	selector: 'app-edit-listing',
	templateUrl: './edit-listing.component.html',
	styleUrls: ['./edit-listing.component.scss']
})
export class EditListingComponent extends RedirectableComponent implements OnInit, OnDestroy {

	private idSubscription: Subscription;
	public property: any;

	public mode = LIST_PROPERTY_MODES.EDIT;

	@ViewChild(ListPropertyComponent)
	private listPropertyComponent: ListPropertyComponent;

	constructor(
		router: Router,
		private route: ActivatedRoute,
		private propertiesService: PropertiesService,
		private zone: NgZone) {
		super(router);
	}

	ngOnInit() {
		const self = this;
		const idObservable: Observable<string> = self.route.params.map(p => p.id);
		this.idSubscription = idObservable.subscribe(async function (propertyId) {
			const property = await self.propertiesService.getProperty(propertyId);
			self.property = property;
			// NOTICE: Fixes buggy angular not redrawing when there is google map in the view
			self.zone.run(() => { });
		});
	}

	ngOnDestroy() {
		this.idSubscription.unsubscribe();
	}

	public async onPropertyUpdated() {
		await this.getPropertyAndUpdateChild();
	}

	private async getPropertyAndUpdateChild() {
		this.property = await this.propertiesService.getProperty(this.property.id);
		this.listPropertyComponent.updatePropertyFields(this.property);
	}

}
