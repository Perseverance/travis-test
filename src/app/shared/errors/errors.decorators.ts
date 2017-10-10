import { ErrorsDecoratableComponent } from './errors.decoratable.component';
/**
 * Decorator - Wraps Error handling for API calls and makes them display certain error
 * @param errorStringKey - the key to the translation that is going to be the title
 */
export function DefaultAsyncAPIErrorHandling(errorStringKey: string) {
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
				const errorResponseData = error.response.data;
				console.log(this);
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