import { NextObserver } from 'rxjs/Observer';
import { Subject } from 'rxjs/Subject';
import { Injectable } from '@angular/core';

export interface DisplayableInfo {
	title: string;
	message: string;
	time: number;
	timeout?: number;
}

@Injectable()
export class NotificationsService {

	private successSubject: Subject<DisplayableInfo>;
	private infoSubject: Subject<DisplayableInfo>;

	constructor() {
		this.successSubject = new Subject();
		this.infoSubject = new Subject();
	}

	public subscribeToSuccess(observer: NextObserver<DisplayableInfo>) {
		this.successSubject.subscribe(observer);
	}

	public pushSuccess(event: DisplayableInfo) {
		this.successSubject.next(event);
	}

	public subscribeToInfo(observer: NextObserver<DisplayableInfo>) {
		this.infoSubject.subscribe(observer);
	}

	public pushInfo(event: DisplayableInfo) {
		this.infoSubject.next(event);
	}

}
