import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../../environments/environment';

@Pipe({ name: 'imageEnvPrefix' })
export class ImageEnvironmentPrefixPipe implements PipeTransform {

	transform(value: string): string {
		if (value.startsWith('http')) {
			return value;
		}
		let imageUrl: string;
		imageUrl = `${environment.apiUrl}${value}`;
		return imageUrl;
	}
}
