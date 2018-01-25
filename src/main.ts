import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

if (environment.production) {
	// HubSpot Embed Code appends to head - prod environment only
	const scriptElement = document.createElement('script');
	scriptElement.setAttribute('type', 'text/javascript');
	scriptElement.setAttribute('id', 'hs-script-loader');
	scriptElement.setAttribute('async', '');
	scriptElement.setAttribute('defer', '');
	scriptElement.setAttribute('src', '//js.hs-scripts.com/4204561.js');
	document.head.appendChild(scriptElement);
	enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
