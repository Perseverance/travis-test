import {Injectable} from '@angular/core';

declare global {
	interface Window { prerenderReady: any; }
}

@Injectable()
export class PrerenderHelperService {

	constructor() {
	}
	
	public prerenderNotReady() {
		window.prerenderReady = false;
	}
	
	public prerenderReady() {
		window.prerenderReady = true;
	}
}
