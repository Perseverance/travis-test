import { Subscription } from 'rxjs/Subscription';
import { MapEventsService, PropertyHoveredEvent } from './../../google-map/map-events.service';
import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { NewPropertyHome } from '../../properties/properties-responses';
import { Router } from '@angular/router';

export enum PROPERTY_THEMES {
	BIG = 'big',
	SMALL = 'small'
}

@Component({
	selector: 'app-new-property-component',
	templateUrl: './new-property-component.component.html',
	styleUrls: ['./new-property-component.component.scss']
})
export class NewPropertyComponentComponent implements OnInit, OnDestroy {
	@Input() property: any;
	@Input() showArrow = true;
	@Input() listenForMapHoverEvents = false;
	@Input() sendHoverEvents = false;
	@Input() cityName: string;
	@Input() theme = PROPERTY_THEMES.SMALL;
	@Input() imageWidth: number;
	@Input() imageHeight: number;
	public isOutsideHovered = false;

	private mapEventsSubscription: Subscription;

	constructor(private router: Router,
		private mapEventsService: MapEventsService) {
	}

	onMouseEnter($event) {
		if (this.sendHoverEvents) {
			this.mapEventsService.pushMapHoverEvent({ propertyId: this.property.id, isHovered: true });
		}
	}

	onMouseLeave($event) {
		if (this.sendHoverEvents) {
			this.mapEventsService.pushMapHoverEvent({ propertyId: this.property.id, isHovered: false });
		}
	}

	ngOnInit() {
		if (this.listenForMapHoverEvents) {
			this.mapEventsSubscription = this.mapEventsService.subscribeToMapHoverEvents({
				next: (event: PropertyHoveredEvent) => {
					this.isOutsideHovered = event.isHovered;
				}
			}, this.property.id);
		}
	}

	ngOnDestroy() {
		if (this.listenForMapHoverEvents) {
			this.mapEventsSubscription.unsubscribe();
		}
	}

	public goToProperty(id: string) {
		this.router.navigate(['property', id]);
	}
}
