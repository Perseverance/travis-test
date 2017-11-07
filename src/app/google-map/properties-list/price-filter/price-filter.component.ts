import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {ThousandSeparatorPipe} from '../../../shared/pipes/thousand-separator.pipe';
import {PropertiesFilter} from '../../../properties/properties.service';
import {CurrencyTypeEnum} from '../../../shared/enums/currency-type.enum';
import {LocalStorageService} from '../../../shared/localStorage.service';

@Component({
	selector: 'app-price-filter',
	templateUrl: './price-filter.component.html',
	styleUrls: ['./price-filter.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PriceFilterComponent implements OnInit {
	public DEFAULT_PRICE_MIN_RANGE = 0;
	public DEFAULT_PRICE_MAX_RANGE = 5000000;
	public DEFAULT_PRICE_STEP = 100000;
	public priceMinRange = this.DEFAULT_PRICE_MIN_RANGE;
	public priceMaxRange = this.DEFAULT_PRICE_MAX_RANGE;
	public sliderDraggingMin = false;
	public sliderDraggingMax = false;
	public priceRangeValue: number[] = [this.DEFAULT_PRICE_MIN_RANGE, this.DEFAULT_PRICE_MAX_RANGE];
	public currencies: SelectItem[];
	public selectedCurrency;
	public filterSelectionActivated = false;
	@Output() onFilterActivated = new EventEmitter<boolean>();
	@Output() onPriceFilterApplied = new EventEmitter<PropertiesFilter>();
	@Output() onAreaFilterApplied = new EventEmitter<PropertiesFilter>();

	constructor(private thousandSeparatorPipe: ThousandSeparatorPipe,
				private localStorageService: LocalStorageService) {
		this.currencies = [];
		this.currencies.push({label: 'USD', value: CurrencyTypeEnum.USD});
		this.currencies.push({label: 'EUR', value: CurrencyTypeEnum.EUR});
		this.currencies.push({label: 'RUB', value: CurrencyTypeEnum.RUB});
		this.currencies.push({label: 'AED', value: CurrencyTypeEnum.AED});
		this.currencies.push({label: 'HKD', value: CurrencyTypeEnum.HKD});
		this.currencies.push({label: 'SGD', value: CurrencyTypeEnum.SGD});
		this.currencies.push({label: 'GBP', value: CurrencyTypeEnum.GBP});
		this.currencies.push({label: 'BGN', value: CurrencyTypeEnum.BGN});
		this.currencies.push({label: 'CNY', value: CurrencyTypeEnum.CNY});
		this.currencies.push({label: 'ETH', value: CurrencyTypeEnum.ETH});
		this.currencies.push({label: 'BTC', value: CurrencyTypeEnum.BTC});
	}

	ngOnInit() {
		this.selectedCurrency = CurrencyTypeEnum.USD;
	}

	public toggleFilterSelectionClass() {
		this.filterSelectionActivated = !this.filterSelectionActivated;
		this.onFilterActivated.emit(this.filterSelectionActivated);
	}

	public changePriceMinRangeInput(input) {
		let inputMinValue = input.value.replace(/[^0-9.]/g, '');
		inputMinValue = parseInt(inputMinValue, 10);
		const currentMaxRange = this.stringRangeValueToNumber(this.priceMaxRange.toString())
		this.priceRangeValue = [];
		if (inputMinValue > currentMaxRange) {
			inputMinValue = currentMaxRange;
		}
		if (inputMinValue > this.DEFAULT_PRICE_MAX_RANGE) {
			inputMinValue = this.DEFAULT_PRICE_MAX_RANGE;
		}
		this.priceRangeValue = [inputMinValue, currentMaxRange];
		input.value = this.thousandSeparatorPipe.transform(inputMinValue);
		this.priceMinRange = input.value;
	}

	public changePriceMaxRangeInput(input) {
		let inputMaxValue = input.value.replace(/[^0-9.]/g, '');
		inputMaxValue = parseInt(inputMaxValue, 10);
		const currentMinRange = this.stringRangeValueToNumber(this.priceMinRange.toString());
		this.priceRangeValue = [];
		if (inputMaxValue < currentMinRange) {
			inputMaxValue = currentMinRange;
		}
		if (inputMaxValue < this.DEFAULT_PRICE_MIN_RANGE) {
			inputMaxValue = this.DEFAULT_PRICE_MIN_RANGE;
		}
		if (inputMaxValue > this.DEFAULT_PRICE_MAX_RANGE) {
			inputMaxValue = this.DEFAULT_PRICE_MAX_RANGE;
		}
		this.priceRangeValue = [currentMinRange, inputMaxValue];
		input.value = this.thousandSeparatorPipe.transform(inputMaxValue);
		this.priceMaxRange = input.value;
	}

	public handlePriceChange(event) {
		if (this.priceMinRange !== event.values[0]) {
			this.sliderDraggingMin = true;
		}

		if (this.priceMaxRange !== event.values[1]) {
			this.sliderDraggingMax = true;
		}

		this.priceMinRange = event.values[0];
		this.priceMaxRange = event.values[1];
	}

	public handleSlideEnd(event) {
		this.sliderDraggingMin = false;
		this.sliderDraggingMax = false;
	}

	public applyPriceFilter(overlay) {
		this.onPriceFilterApplied.emit({
			priceFilter: {
				minValue: this.stringRangeValueToNumber(this.priceMinRange.toString()),
				maxValue: this.stringRangeValueToNumber(this.priceMaxRange.toString()),
				currency: this.selectedCurrency
			}
		});
		overlay.hide();
	}

	private stringRangeValueToNumber(value: string): number {
		const rangeStr = value.replace(/[^0-9.]/g, '');
		return parseInt(rangeStr, 10);
	}

	public currencyTypeChanged(currencyType: number) {
		this.localStorageService.selectedCurrencyType = currencyType;
	}
}
