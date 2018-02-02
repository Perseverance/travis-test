// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
	production: false,
	apiUrl: 'http://servicepropydev.azurewebsites.net',
	googleMaps: {
		apiKey: 'AIzaSyAcgGhw1a6q4Y0ZOIeHFw0NrBT3XtXUhQU',
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
	smartLookId: '3e92012c793f28d6d226a85cc4428e5d5af0cfc0',
	stripePublicKey: 'pk_test_6wYpDH9rwqlyS2V6Vagdtsi2',
	googleAnalyticsId: 'UA-110127661-1',
	pusher: {
		key: '5f7c7a18cc55e6c0d7d3',
		cluster: 'eu'
	},
	helloSign: {
		clientId: '30a28cd02d7f49d1293ab1207d23fdce',
		skipDomainVerification: true
	},
	hardCodedDeedParties: {
		agentId: '5a255409495fda1268997297'
	},
	contractAddress: '0x6dae591ae5a4cc8a65ef88c9367564be1a317bf0',
	// web3Provider: 'http://localhost:8545',
	infuraKey: '',
	infuraLink: 'https://rinkeby.infura.io/Up5uvBHSCSqtOmnlhL87',
	escrowAddress: '0x9BaA0E7c890E356c050326EC8EFf627d9fa59625',
	etherscanTxLink: 'https://rinkeby.etherscan.io/tx/'
};
