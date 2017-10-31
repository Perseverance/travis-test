import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
	name: 'imageSize'
})
export class ImageSizePipe implements PipeTransform {


	transform(value: any, width: number, height: number, enableCrop = true, scale = 'both'): any {
		let mode = '';
		if (enableCrop) {
			mode = '&mode=crop';
		}

		return `${value}?width=${width}&height=${height}&scale=${scale}${mode}`;
	}

}
