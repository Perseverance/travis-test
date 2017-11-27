export const environment = {
	production: true,
	apiUrl: 'https://servicepropy.azurewebsites.net',
	googleMaps: {
		apiKey: 'AIzaSyDzuZpv8iXJL2lPLqvKU0J4KdFONwSPjGk',
		defaultLanguage: 'en'
	},
	clientId: 'PropyWebsite',
	clientSecret: 'PixelIsNotFat',
	fbConfigParams: {
		appId: '107043006300971',
		xfbml: true,
		version: 'v2.10'
	},
	linkedInApiKey: '758vh4r0yqsbn9', // Otherwise known as ClientID
	skippedRedirectRoutes: ['/login', '/signup'],
	defaultRedirectRoute: '/',
	mapConfig: {
		DEFAULT_MARKER_ICON: '/assets/images/marker-shape.png',
		DEFAULT_MARKER_ICON_HOVERED: '/assets/images/marker-shape-hovered.png',
		DEFAULT_MARKER_LABEL_COLOR: '#18ADE2',
		DEFAULT_MARKER_LABEL_COLOR_HOVERED: '#FFFFFF',
		DEFAULT_MARKER_LABEL_FONT_SIZE: '11px',
		MAP_DEFAULT_ZOOM: 12
	},
	intercomClientId: 'ot4ofyvp',
	smartLookId: '6bb5a0bdab863c838a4ecf0000364eec693fa91e',
	stripePublicKey: 'pk_live_Rejlq3HMVQLAAXkZRxSSDM5l',
	googleAnalyticsId: 'UA-65716380-2'
};
