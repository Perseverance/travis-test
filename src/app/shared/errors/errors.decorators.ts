import { ErrorsDecoratableComponent } from './errors.decoratable.component';
/**
 * Decorator - Wraps Error handling for API calls and makes them display certain error
 * @param errorStringKey - the key to the translation that is going to be the title
 * @param message - optional key for the message
 */
export function DefaultAsyncAPIErrorHandling(errorStringKey: string, message?: string) {
	return function (target: Object, propertyKey: string, descriptor: TypedPropertyDescriptor<any>) {
		const isTargetErrorDecoratable = target instanceof ErrorsDecoratableComponent;
		if (!isTargetErrorDecoratable) {
			throw new Error('This target is not decoratable. Make sure you extend ErrorsDecoratableComponent');
		}

		const originalMethod = descriptor.value;

		descriptor.value = async function (...args: any[]) {
			try {
				const result = await originalMethod.apply(this, args);
			} catch (error) {
				console.error(error);
				if (message) {
					this.translateService.get([errorStringKey, message]).subscribe((keyTranslations) => {
						this.errorsService.pushError({
							errorTitle: keyTranslations[errorStringKey],
							errorMessage: keyTranslations[message],
							errorTime: (new Date()).getTime()
						});
					});
					return;
				}
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
