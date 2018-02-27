import { currencyLabels } from './currencyLabels.model';
import { ErrorsService } from './../../shared/errors/errors.service';
import { GoogleAnalyticsEventsService } from './../../shared/google-analytics.service';
import { PropertyConversionService } from './../../shared/property-conversion.service';
import { ImageEnvironmentPrefixPipe } from './../../shared/pipes/image-environment-prefix.pipe';
import { ImageSizePipe } from './../../shared/pipes/image-size.pipe';
import { TranslateService } from '@ngx-translate/core';
import { GoogleMapsMarkersService } from './../../shared/google-maps-markers.service';
import { CurrencySymbolPipe } from './../../shared/pipes/currency-symbol.pipe';
import { BigNumberFormatPipe } from './../../shared/pipes/big-number-format.pipe';
import { environment } from './../../../environments/environment';
import { NgxCarousel } from 'ngx-carousel';
import { RedirectableComponent } from './../../shared/redirectable/redirectable.component';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { PropertiesService } from './../properties.service';
import {
	Component,
	OnInit,
	OnDestroy,
	ViewEncapsulation,
	NgZone,
	ViewChild
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { LanguagesEnum } from '../../shared/enums/supported-languages.enum';
import { LocalStorageService } from '../../shared/localStorage.service';
import { MomentService } from '../../shared/moment.service';
import { CurrencyEnum } from '../../shared/enums/supported-currencies.enum';
import { CurrencyTypeEnum } from '../../shared/enums/currency-type.enum';
import { MetaService } from '@ngx-meta/core';
import { PrerenderHelperService } from '../../shared/prerender-helper.service';

@Component({
	selector: 'app-property-details',
	templateUrl: './property-details.component.html',
	styleUrls: ['./property-details.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PropertyDetailsComponent extends RedirectableComponent implements OnInit, OnDestroy {

	public property: any;
	public options: any;
	public overlays: any[];
	private idSubscription: Subscription;
	private languageCurrencySubscriptions = new Array<Subscription>();
	public propertyImagesCarouselConfig: NgxCarousel;
	public IMAGE_HEIGHT_PX: number;
	public IMAGE_WIDTH_PX: number;
	private DEFAULT_ZOOM = environment.mapConfig.MAP_DEFAULT_ZOOM;
	@ViewChild('gmap') map: any;

	public featureScale: object;
	public publicTransportScale: object;
	public binaryScale: object;

	public isPropertyReserved = false;
	public isPropertyReservedByYou = false;

	private walletErrorTitle: string;
	private walletErrorMessage: string;

	private verificationError: string;
	private verificationMessage: string;

	private notLoggedInError: string;
	public userInfo: any;
	public currencyLabelsTranslations: object;
	public cryptoBtc = false;
	public cryptoEth = false;
	public cryptoFiat = false;

	public isChina: Boolean = environment.china;

	constructor(router: Router,
		private route: ActivatedRoute,
		private propertiesService: PropertiesService,
		private authService: AuthenticationService,
		private googleMarkersService: GoogleMapsMarkersService,
		private bigNumberPipe: BigNumberFormatPipe,
		private currencySymbolPipe: CurrencySymbolPipe,
		private zone: NgZone,
		private translateService: TranslateService,
		private storageService: LocalStorageService,
		private momentService: MomentService,
		private errorsService: ErrorsService,
		public googleAnalyticsEventsService: GoogleAnalyticsEventsService,
		private imageSizePipe: ImageSizePipe,
		private imageEnvironmentPrefixPipe: ImageEnvironmentPrefixPipe,
		private propertyConversionService: PropertyConversionService,
		private metaService: MetaService,
		private prerenderHelperService: PrerenderHelperService) {
		super(router);

		this.prerenderHelperService.prerenderNotReady();

		if (window.screen.width > 990) {
			this.IMAGE_WIDTH_PX = window.screen.width * 0.6;
		} else {
			this.IMAGE_WIDTH_PX = window.screen.width;
		}
		this.IMAGE_HEIGHT_PX = 480;

		this.languageCurrencySubscriptions.push(this.setupQueryParamsWatcher());

		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				this.userInfo = userInfo;
			}
		});
	}

	async ngOnInit() {
		this.googleAnalyticsEventsService.emitEvent('page-property', 'property');

		this.propertyImagesCarouselConfig = {
			grid: { xs: 1, sm: 1, md: 2, lg: 2, all: 0 },
			slide: 1,
			speed: 600,
			point: {
				visible: true,
				pointStyles: `.ngxcarouselPoint {display: none}` // Removing the points as the visible: false property does not work
			},
			easing: 'ease'
		};
		this.translateService.stream([
			'common.scales.undefined',
			'common.scales.feature-scale.no',
			'common.scales.feature-scale.low',
			'common.scales.feature-scale.moderate',
			'common.scales.feature-scale.high',
			'common.scales.public-transport-scale.low',
			'common.scales.public-transport-scale.medium',
			'common.scales.public-transport-scale.good',
			'common.scales.public-transport-scale.excellent',
			'common.scales.binary-scale.yes',
			'common.scales.binary-scale.no',
			'property-details.no-wallet-set',
			'property-details.no-wallet-set-message',
			'property-details.verification-error',
			'property-details.verification-error-message',
			'common.only-registered-error',
			'property-details.currency-labels.buy-with-btc',
			'property-details.currency-labels.buy-with-eth',
			'property-details.currency-labels.buy-with-crc',
			'property-details.currency-labels.buy-online',
		]).subscribe((translations) => {
			this.featureScale = {
				undefined: translations['common.scales.undefined'],
				0: translations['common.scales.undefined'],
				1: translations['common.scales.feature-scale.no'],
				2: translations['common.scales.feature-scale.low'],
				3: translations['common.scales.feature-scale.moderate'],
				4: translations['common.scales.feature-scale.high']
			};

			this.publicTransportScale = {
				undefined: translations['common.scales.undefined'],
				0: translations['common.scales.undefined'],
				2: translations['common.scales.public-transport-scale.low'],
				1: translations['common.scales.public-transport-scale.medium'],
				3: translations['common.scales.public-transport-scale.good'],
				4: translations['common.scales.public-transport-scale.excellent']
			};

			this.binaryScale = {
				undefined: translations['common.scales.undefined'],
				0: translations['common.scales.undefined'],
				1: translations['common.scales.binary-scale.yes'],
				2: translations['common.scales.binary-scale.no']
			};
			this.currencyLabelsTranslations = {
				0: translations['property-details.currency-labels.buy-with-btc'],
				1: translations['property-details.currency-labels.buy-with-eth'],
				2: translations['property-details.currency-labels.buy-with-crc'],
				3: translations['property-details.currency-labels.buy-online']
			};

			this.walletErrorTitle = translations['property-details.no-wallet-set'];
			this.walletErrorMessage = translations['property-details.no-wallet-set-message'];
			this.verificationError = translations['property-details.verification-error'];
			this.verificationMessage = translations['property-details.verification-error-message'];
			this.notLoggedInError = translations['common.only-registered-error'];

		});
		const self = this;
		const idObservable: Observable<string> = self.route.params.map(p => p.id);
		this.idSubscription = idObservable.subscribe(async function (propertyId) {
			// temporary solution for Packer house
			propertyId = self.emulatePackerHousePropertyId(propertyId);
			const property = await self.propertiesService.getProperty(propertyId);
			self.setupMetaTags(property);
			self.prerenderHelperService.prerenderReady();
			self.createAndSetMapOptions(property);
			self.createAndSetPropertyMarker(property);
			self.property = property;
			self.checkIfPropertyReservedByYou(property);
			// NOTICE: Fixes buggy angular not redrawing when there is google map in the view
			self.zone.run(() => {
			});
			if (self.property.acceptedCurrencies) {
				self.property.acceptedCurrencies.forEach(element => {
					if (element === 10) {
						self.cryptoEth = true;
					} else if (element === 11) {
						self.cryptoBtc = true;
					} else if (element < 10) {
						self.cryptoFiat = true;
					}
				});
			}
		});
	}
	public get currencyLabel() {
		if (this.cryptoFiat && !this.cryptoBtc && !this.cryptoEth) {
			return 'fiat';
		} else if (this.cryptoBtc && this.cryptoEth) {
			return 'crypto';
		} else if (this.cryptoBtc && !this.cryptoEth) {
			return 'btc';
		} else if (!this.cryptoBtc && this.cryptoEth) {
			return 'eth';
		}
	}
	public get currencyTranslation() {
		return this.currencyLabelsTranslations[currencyLabels[this.currencyLabel]];
	}

	private setupMetaTags(property: any) {
		const imgUrl = this.imageSizePipe.transform(this.imageEnvironmentPrefixPipe.transform(property.imageUrls[0]), 1200, 630);
		const propertyType = this.propertyConversionService.getPropertyTypeName(property.type);
		let title = `${propertyType} in `;
		if (property.city) {
			title += property.city;
		} else {
			title += property.address;
		}
		this.metaService.setTitle(title);
		this.metaService.setTag('og:image', imgUrl);
		this.metaService.setTag('og:url', window.location.href);
	}

	private emulatePackerHousePropertyId(propertyId) {
		if (propertyId === 'packer' || propertyId === 'packer-house') {
			return '5a3980e64170310df43e959a';
		}
		return propertyId;
	}

	private createAndSetMapOptions(property: any) {
		this.options = {
			center: { lat: property.latitude, lng: property.longitude },
			zoom: this.DEFAULT_ZOOM
		};
	}

	private createAndSetPropertyMarker(property: any) {
		const marker = new google.maps.Marker(
			{
				position: { lat: property.latitude, lng: property.longitude },
				icon: this.googleMarkersService.defaultMarkerSettings,
				label: this.googleMarkersService.getMarkerLabel
					(this.bigNumberPipe.transform(this.currencySymbolPipe.transform(property.price.value.toString()), true))
			});
		this.overlays = [marker];
	}

	ngOnDestroy() {
		this.idSubscription.unsubscribe();
	}

	public draw() {
		google.maps.event.trigger(this.map.el.nativeElement, 'resize');
		this.zone.run(() => {
		});
	}

	private async checkIfPropertyReservedByYou(property: any) {
		this.isPropertyReserved = (property.reservedByUserId && property.reservedByUserId.length > 0);
		if (!this.isPropertyReserved) {
			return;
		}

		const currentUser = await this.authService.getCurrentUser(true, true);
		this.isPropertyReservedByYou = (currentUser.data.data.id === property.reservedByUserId);
	}

	private setupQueryParamsWatcher() {
		return this.route.queryParams
			.subscribe(params => {
				if (params.language) {
					this.applyParamLanguage(params.language);
				}
				if (params.currency) {
					this.applyParamCurrency(params.currency);
				}

			});
	}

	private applyParamLanguage(language: string) {
		const requestedLanguage = language.toLowerCase();
		if (!this.isSupportedLanguage(requestedLanguage)) {
			return;
		}

		this.translateService.use(requestedLanguage);
		this.momentService.moment.locale(requestedLanguage);
		this.storageService.selectedLanguage = requestedLanguage;
	}

	private isSupportedLanguage(language: string): boolean {
		if (language === LanguagesEnum.ENGLISH ||
			language === LanguagesEnum.CHINESE ||
			language === LanguagesEnum.ARABIC ||
			language === LanguagesEnum.RUSSIAN) {
			return true;
		}
		return false;
	}

	private applyParamCurrency(currency: string) {
		const requestedCurrency = currency.toUpperCase();
		if (!this.isSupportedCurrency(requestedCurrency)) {
			return;
		}

		this.storageService.selectedCurrencyType = CurrencyTypeEnum[`${requestedCurrency}`];
	}

	private isSupportedCurrency(currency: string): boolean {
		if (currency === CurrencyEnum.unitedStatesDollar ||
			currency === CurrencyEnum.europeanEuro ||
			currency === CurrencyEnum.russianRuble ||
			currency === CurrencyEnum.uaeDirham ||
			currency === CurrencyEnum.hongKongDollar ||
			currency === CurrencyEnum.singaporeDollar ||
			currency === CurrencyEnum.poundSterling ||
			currency === CurrencyEnum.bulgarianLev ||
			currency === CurrencyEnum.chineseYuanRenminbi ||
			currency === CurrencyEnum.ether ||
			currency === CurrencyEnum.bitcoin) {
			return true;
		}
		return false;
	}

	public async reserveProperty($event) {
		event.preventDefault();
		event.stopPropagation();
		const currentUser = await this.authService.getCurrentUser();
		if (this.authService.isUserAnonymous) {
			this.errorsService.pushError({
				errorTitle: '',
				errorMessage: this.notLoggedInError,
				errorTime: (new Date()).getDate()
			});
			return;
		}
		if (!currentUser.data.data.isEmailVerified) {
			this.errorsService.pushError({
				errorTitle: this.verificationError,
				errorMessage: this.verificationMessage,
				errorTime: (new Date()).getDate()
			});
			return;
		}
		if (!currentUser.data.data.jsonFile) {
			this.errorsService.pushError({
				errorTitle: this.walletErrorTitle,
				errorMessage: this.walletErrorMessage,
				errorTime: (new Date()).getDate()
			});
			return;
		}
		this.router.navigate(['/purchase', this.property.id]);
	}
}
