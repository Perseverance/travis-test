import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {ThousandSeparatorPipe} from '../../../shared/pipes/thousand-separator.pipe';

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

	constructor(private thousandSeparatorPipe: ThousandSeparatorPipe) {
		this.currencies = [];
		this.currencies.push({label: 'USD', value: 1});
		this.currencies.push({label: 'EUR', value: 2});
		this.currencies.push({label: 'RUB', value: 3});
		this.currencies.push({label: 'AED', value: 4});
		this.currencies.push({label: 'HKD', value: 5});
		this.currencies.push({label: 'SGD', value: 6});
		this.currencies.push({label: 'GBP', value: 7});
		this.currencies.push({label: 'BGN', value: 8});
		this.currencies.push({label: 'CNY', value: 9});
		this.currencies.push({label: 'ETH', value: 10});
		this.currencies.push({label: 'BTC', value: 11});
	}

	ngOnInit() {
		this.selectedCurrency = 1;
	}

	public toggleFilterSelectionClass() {
		this.filterSelectionActivated = !this.filterSelectionActivated;
		this.onFilterActivated.emit(this.filterSelectionActivated);
	}

	public changePriceMinRangeInput(input) {
		let inputMinValue = input.value.replace(/[^0-9.]/g, '');
		inputMinValue = parseInt(inputMinValue, 10);
		this.priceRangeValue = [];
		if (inputMinValue > this.priceMaxRange) {
			inputMinValue = this.priceMaxRange;
		}
		if (inputMinValue > this.DEFAULT_PRICE_MAX_RANGE) {
			inputMinValue = this.DEFAULT_PRICE_MAX_RANGE;
		}
		this.priceRangeValue = [inputMinValue, this.priceMaxRange];
		input.value = this.thousandSeparatorPipe.transform(inputMinValue);
		this.priceMinRange = input.value;
	}

	public changePriceMaxRangeInput(input) {
		let inputMaxValue = input.value.replace(/[^0-9.]/g, '');
		inputMaxValue = parseInt(inputMaxValue, 10);
		this.priceRangeValue = [];
		if (inputMaxValue < this.priceMinRange) {
			inputMaxValue = this.priceMinRange;
		}
		if (inputMaxValue < this.DEFAULT_PRICE_MIN_RANGE) {
			inputMaxValue = this.DEFAULT_PRICE_MIN_RANGE;
		}
		if (inputMaxValue > this.DEFAULT_PRICE_MAX_RANGE) {
			inputMaxValue = this.DEFAULT_PRICE_MAX_RANGE;
		}
		this.priceRangeValue = [this.priceMinRange, inputMaxValue];
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
		// ToDo: Apply filter call
		console.log(this.priceMinRange);
		console.log(this.priceMaxRange);
		console.log(this.selectedCurrency);
		overlay.hide();
	}
}
