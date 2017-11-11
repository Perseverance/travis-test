import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

export interface PropertyHoveredEvent {
	propertyId: string;
	isHovered: boolean;
}

@Injectable()
export class MapEventsService {

	private infoSubject: Subject<PropertyHoveredEvent>;

	constructor() { }

	public subscribeToMapHoverEvents(observer: NextObserver<PropertyHoveredEvent>) {
		this.infoSubject.subscribe(observer);
	}

	public pushMapHoverEvent(event: PropertyHoveredEvent) {
		this.infoSubject.next(event);
	}

}
