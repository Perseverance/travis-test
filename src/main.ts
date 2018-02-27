import {enableProdMode} from '@angular/core';
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';

import {AppModule} from './app/app.module';
import {environment} from './environments/environment';

const mapsScript = document.createElement('script');
mapsScript.setAttribute('type', 'text/javascript');


// Check if in China
if (environment.china) {
	mapsScript.setAttribute(
		'src',
		'https://maps.google.cn/maps/api/js?key=AIzaSyDzuZpv8iXJL2lPLqvKU0J4KdFONwSPjGk&libraries=places&callback'
	);
} else {
	mapsScript.setAttribute(
		'src',
		'https://maps.googleapis.com/maps/api/js?key=AIzaSyDzuZpv8iXJL2lPLqvKU0J4KdFONwSPjGk&libraries=places&callback'
	);

	// FACEBOOK EVENTS --------------------------------
	const fbScript = document.createElement('script');
	fbScript.setAttribute('type', 'text/javascript');

	fbScript.setAttribute(
		'src',
		'assets/libs/facebook.js'
	);

	document.head.appendChild(fbScript);
	// ------------------------------------------------

	// FB SDK -----------------------------------------
	const fbSDK = document.createElement('script');
	fbSDK.setAttribute('type', 'text/javascript');

	fbSDK.setAttribute(
		'src',
		'https://connect.facebook.net/en_US/sdk.js'
	);

	document.body.appendChild(fbSDK);
	// ------------------------------------------------

	// HELLOSIGN --------------------------------------
	const helloSign = document.createElement('script');
	helloSign.setAttribute('type', 'text/javascript');

	helloSign.setAttribute(
		'src',
		'https://s3.amazonaws.com/cdn.hellosign.com/public/js/hellosign-embedded.LATEST.min.js'
	);

	document.body.appendChild(helloSign);
	// ------------------------------------------------


	// INFO BUBBLE ------------------------------------
	const infoBubble = document.createElement('script');
	infoBubble.setAttribute('type', 'text/javascript');

	infoBubble.setAttribute(
		'src',
		'assets/libs/InfoBubble.js'
	);

	document.body.appendChild(infoBubble);
	// ------------------------------------------------
}

document.head.appendChild(mapsScript);

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
