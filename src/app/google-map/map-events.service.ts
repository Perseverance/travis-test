import { PropertyHoveredEvent } from './map-events.service';
import { NextObserver } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

export interface PropertyHoveredEvent {
	propertyId: string;
	isHovered: boolean;
}

@Injectable()
export class MapEventsService {

	private hoverSubject: Subject<PropertyHoveredEvent>;

	constructor() {
		this.hoverSubject = new Subject();
	}

	public subscribeToMapHoverEvents(observer: NextObserver<PropertyHoveredEvent>, listenForProperty?: string) {
		if (listenForProperty) {
			return this.hoverSubject.filter((value: PropertyHoveredEvent) => {
				return value.propertyId === listenForProperty;
			}).subscribe(observer);
		}
		return this.hoverSubject.subscribe(observer);
	}

	public pushMapHoverEvent(event: PropertyHoveredEvent) {
		return this.hoverSubject.next(event);
	}

}
