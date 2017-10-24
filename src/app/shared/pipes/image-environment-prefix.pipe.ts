import {Pipe, PipeTransform} from '@angular/core';
import {environment} from '../../../environments/environment';

@Pipe({name: 'imageEnvPrefix'})
export class ImageEnvironmentPrefixPipe implements PipeTransform {

	transform(value: string): string {
		let imageUrl: string;
		imageUrl = `${environment.apiUrl}${value}`
		return imageUrl;
	}
}
