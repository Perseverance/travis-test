export const environment = {
	production: true,
	apiUrl: 'https://api.propy.com',
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
	intercomClientId: 'zpladqap',
	smartLookId: '6bb5a0bdab863c838a4ecf0000364eec693fa91e',
	stripePublicKey: 'pk_live_Rejlq3HMVQLAAXkZRxSSDM5l',
	googleAnalyticsId: 'UA-65716380-2',
	pusher: {
		key: '5f7c7a18cc55e6c0d7d3',
		cluster: 'eu'
	},
	helloSign: {
		clientId: '30a28cd02d7f49d1293ab1207d23fdce',
		skipDomainVerification: false
	},
	hardCodedDeedParties: {
		agentId: '5a255409495fda1268997297'
	},
	contractAddress: '0x6dae591ae5a4cc8a65ef88c9367564be1a317bf0',
	infuraLink: 'https://rinkeby.infura.io/Up5uvBHSCSqtOmnlhL87',
	escrowAddress: '0x9BaA0E7c890E356c050326EC8EFf627d9fa59625',
	etherscanTxLink: 'https://etherscan.io/tx/'
};
