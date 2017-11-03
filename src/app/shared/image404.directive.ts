import { Directive, HostListener, HostBinding, Input, ElementRef } from '@angular/core';

@Directive({
	// tslint:disable-next-line:directive-selector
	selector: 'img'
})
export class Image404Directive {

	@HostListener('error') onError() {
		this.el.nativeElement.src = '/assets/images/image-404.png';
	}

	constructor(private el: ElementRef) {
	}

}
