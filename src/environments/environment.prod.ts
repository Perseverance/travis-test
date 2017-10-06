export const environment = {
	production: true,
	apiUrl: 'http://servicepropy.azurewebsites.net',
	googleMaps: {
		apiKey: 'AIzaSyAcgGhw1a6q4Y0ZOIeHFw0NrBT3XtXUhQU', // ToDo: This apiKey is generated for dev. Change it.
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
	defaultRedirectRoute: '/map'
};
