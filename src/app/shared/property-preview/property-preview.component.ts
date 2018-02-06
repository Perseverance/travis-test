import { TranslateService } from '@ngx-translate/core';
import { PropertiesService } from './../../properties/properties.service';
import { Subscription } from 'rxjs/Subscription';
import { MapEventsService, PropertyHoveredEvent } from './../../google-map/map-events.service';
import { Component, Input, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router } from '@angular/router';

export enum PROPERTY_THEMES {
	BIG = 'big',
	SMALL = 'small'
}

@Component({
	selector: 'app-property-preview',
	templateUrl: './property-preview.component.html',
	styleUrls: ['./property-preview.component.scss']
})
export class PropertyPreviewComponent implements OnInit, OnDestroy {
	@Input() property: any;
	@Input() showArrow = true;
	@Input() listenForMapHoverEvents = false;
	@Input() sendHoverEvents = false;
	@Input() cityName: string;
	@Input() theme = PROPERTY_THEMES.SMALL;
	@Input() imageWidth: number;
	@Input() imageHeight: number;
	@Input() inactiveComponent = false;
	@Input() isHiddenIconShown = false;
	@Input() featuredCityName: string;
	@Input() isPropertyShareable = false;
	@Input() userInfo: any;
	public isOutsideHovered = false;
	public isPropertyHidden = false;
	public currencyLabelsTranslations: object;
	public currencyLabel: string;
	public cryptoBtc = false;
	public cryptoEth = false;
	public cryptoFiat = false;

	private mapEventsSubscription: Subscription;

	constructor(private router: Router,
		private mapEventsService: MapEventsService,
		private propertiesService: PropertiesService,
		private translateService: TranslateService) {
	}

	onMouseEnter() {
		if (this.sendHoverEvents) {
			this.mapEventsService.pushMapHoverEvent({ propertyId: this.property.id, isHovered: true });
		}
	}

	onMouseLeave() {
		if (this.sendHoverEvents) {
			this.mapEventsService.pushMapHoverEvent({ propertyId: this.property.id, isHovered: false });
		}
	}

	ngOnInit() {
		if (this.listenForMapHoverEvents) {
			this.mapEventsSubscription = this.mapEventsService.subscribeToMapHoverEvents({
				next: (event: PropertyHoveredEvent) => {
					this.isOutsideHovered = event.isHovered;
				}
			}, this.property.id);
		}
		this.translateService.stream([
			'property-details.currency-labels.buy-with-btc',
			'property-details.currency-labels.buy-with-eth',
			'property-details.currency-labels.buy-with-crc',
			'property-details.currency-labels.buy-online',
		]).subscribe((translations) => {
			this.currencyLabelsTranslations = {
				0: translations['property-details.currency-labels.buy-with-btc'],
				1: translations['property-details.currency-labels.buy-with-eth'],
				2: translations['property-details.currency-labels.buy-with-crc'],
				3: translations['property-details.currency-labels.buy-online']
			};

		});
		if (this.property.acceptedCurrencies) {
			this.property.acceptedCurrencies.forEach(element => {
				if (element === 10) {
					this.cryptoEth = true;
				} else if (element === 11) {
					this.cryptoBtc = true;
				} else if (element < 10) {
					this.cryptoFiat = true;
				}
			});
			if (this.cryptoFiat && !this.cryptoBtc && !this.cryptoEth) {
				this.currencyLabel = 'fiat';
			} else if (this.cryptoBtc && this.cryptoEth && !this.cryptoFiat) {
				this.currencyLabel = 'crypto';
			} else if (this.cryptoBtc && !this.cryptoEth) {
				this.currencyLabel = 'btc';
			} else if (!this.cryptoBtc && this.cryptoEth) {
				this.currencyLabel = 'eth';
			} else if (this.cryptoFiat && this.cryptoBtc && !this.cryptoEth) {
				this.currencyLabel = 'btc';
			} else if (this.cryptoFiat && this.cryptoEth && !this.cryptoBtc) {
				this.currencyLabel = 'eth';
			} else if (this.cryptoFiat && this.cryptoBtc && this.cryptoEth) {
				this.currencyLabel = 'crypto';
			}
		}
	}

	ngOnDestroy() {
		if (this.listenForMapHoverEvents) {
			this.mapEventsSubscription.unsubscribe();
		}
	}

	public goToProperty(id: string) {
		if (this.inactiveComponent) {
			return;
		}
		this.router.navigate(['property', id]);
	}

	public async propertyHide(event) {
		event.stopPropagation();
		this.isPropertyHidden = !this.isPropertyHidden;
		const result = await this.propertiesService.hideProperty(this.property.id, this.isPropertyHidden);

	}
}
