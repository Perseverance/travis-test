import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { NextObserver } from 'rxjs/Observer';

export interface DisplayableError {
	errorTitle: string;
	errorMessage: string;
	errorTime: number;
}

@Injectable()
export class ErrorsService {

	private errorsSubject: Subject<DisplayableError>;

	constructor() {
		this.errorsSubject = new Subject();
	}

	/**
	 * @example <caption>Listening for Errors</caption>
	 * this.errorsService.subscribeToErrors({
	 *		next: (error: DisplayableError) => {
	 *			console.log(error.errorMessage, error.errorTime);
	 *		}
	 *	});
	 * @param observer - the observer object to handle the pushed errors
	 */
	public subscribeToErrors(observer: NextObserver<DisplayableError>) {
		this.errorsSubject.subscribe(observer);
	}

	/**
	 * @example <caption>Pushing an Error</caption>
	 * this.errorsService.pushError({
	 * 		errorMessage: 'Test Error',
	 *		errorTime: 10232323231
	 *	});
	 * @param error - The error to be sent to the listeners
	 */
	public pushError(error: DisplayableError) {
		this.errorsSubject.next(error);
	}


}
