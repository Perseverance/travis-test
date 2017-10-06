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

	constructor(private translateService: TranslateService) {
		this.errorsSubject = new Subject();
	}

	/**
	 * Decorator - Wraps Error handling for API calls and makes them display certain error
	 * @param errorStringKey - the key to the translation that is going to be the title
	 */
	static DefaultAsyncAPIErrorHandling(errorStringKey: string) {
		return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
			const originalMethod = descriptor.value;

			descriptor.value = async function (...args: any[]) {
				try {
					const result = await originalMethod.apply(this, args);
				} catch (error) {
					const errorResponseData = error.response.data;
					this.translateService.get(errorStringKey).subscribe((keyTranslation: string) => {
						this.errorsService.pushError({
							errorTitle: keyTranslation,
							errorMessage: errorResponseData.error,
							errorTime: (new Date()).getTime()
						});
					});

				}
			};
			return descriptor;
		};
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
