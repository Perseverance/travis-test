import {Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {PropertiesFilter} from '../../../properties/properties.service';
import {ThousandSeparatorPipe} from '../../../shared/pipes/thousand-separator.pipe';

@Component({
	selector: 'app-area-filter',
	templateUrl: './area-filter.component.html',
	styleUrls: ['./area-filter.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AreaFilterComponent implements OnInit {
	public DEFAULT_AREA_MIN_RANGE = 10;
	public DEFAULT_AREA_MAX_RANGE = 10000;
	public DEFAULT_AREA_STEP = 10;
	public areaMinRange = this.DEFAULT_AREA_MIN_RANGE;
	public areaMaxRange = this.DEFAULT_AREA_MAX_RANGE;
	public sliderDraggingMin = false;
	public sliderDraggingMax = false;
	public areaRangeValue: number[] = [this.DEFAULT_AREA_MIN_RANGE, this.DEFAULT_AREA_MAX_RANGE];
	public areaUnits: SelectItem[];
	public selectedAreaUnit;
	public filterSelectionActivated = false;
	@Input() areaFilterApplied: boolean;
	@Output() onFilterActivated = new EventEmitter<boolean>();
	@Output() onAreaFilterApplied = new EventEmitter<PropertiesFilter>();

	constructor(private thousandSeparatorPipe: ThousandSeparatorPipe) {
		this.areaUnits = [];
		this.areaUnits.push({label: 'sqm', value: 1});
		this.areaUnits.push({label: 'sqft', value: 2});
	}

	ngOnInit() {
		this.selectedAreaUnit = 1;
	}

	public toggleFilterSelectionClass() {
		this.filterSelectionActivated = !this.filterSelectionActivated;
		this.onFilterActivated.emit(this.filterSelectionActivated);
	}

	public changeAreaMinRangeInput(input) {
		let inputMinValue = input.value.replace(/[^0-9.]/g, '');
		inputMinValue = parseInt(inputMinValue, 10);
		const currentMaxRange = this.stringRangeValueToNumber(this.areaMaxRange.toString())
		this.areaRangeValue = [];
		if (inputMinValue > currentMaxRange) {
			inputMinValue = currentMaxRange;
		}
		if (inputMinValue > this.DEFAULT_AREA_MAX_RANGE) {
			inputMinValue = this.DEFAULT_AREA_MAX_RANGE;
		}
		if (inputMinValue < this.DEFAULT_AREA_MIN_RANGE) {
			inputMinValue = this.DEFAULT_AREA_MIN_RANGE;
		}
		this.areaRangeValue = [inputMinValue, currentMaxRange];
		input.value = this.thousandSeparatorPipe.transform(inputMinValue);
		this.areaMinRange = input.value;
	}

	public changeAreaMaxRangeInput(input) {
		let inputMaxValue = input.value.replace(/[^0-9.]/g, '');
		inputMaxValue = parseInt(inputMaxValue, 10);
		const currentMinRange = this.stringRangeValueToNumber(this.areaMinRange.toString());
		this.areaRangeValue = [];
		if (inputMaxValue < currentMinRange) {
			inputMaxValue = currentMinRange;
		}
		if (inputMaxValue < this.DEFAULT_AREA_MIN_RANGE) {
			inputMaxValue = this.DEFAULT_AREA_MIN_RANGE;
		}
		if (inputMaxValue > this.DEFAULT_AREA_MAX_RANGE) {
			inputMaxValue = this.DEFAULT_AREA_MAX_RANGE;
		}
		this.areaRangeValue = [currentMinRange, inputMaxValue];
		input.value = this.thousandSeparatorPipe.transform(inputMaxValue);
		this.areaMaxRange = input.value;
	}

	public handleAreaChange(event) {
		if (this.areaMinRange !== event.values[0]) {
			this.sliderDraggingMin = true;
		}

		if (this.areaMaxRange !== event.values[1]) {
			this.sliderDraggingMax = true;
		}

		this.areaMinRange = event.values[0];
		this.areaMaxRange = event.values[1];
	}

	public handleSlideEnd(event) {
		this.sliderDraggingMin = false;
		this.sliderDraggingMax = false;
	}

	public applyAreaFilter(overlay) {
		this.onAreaFilterApplied.emit({
			areaFilter: {
				minValue: this.stringRangeValueToNumber(this.areaMinRange.toString()),
				maxValue: this.stringRangeValueToNumber(this.areaMaxRange.toString()),
				areaUnit: this.selectedAreaUnit
			}
		});
		overlay.hide();
	}

	private stringRangeValueToNumber(value: string): number {
		const rangeStr = value.replace(/[^0-9.]/g, '');
		return parseInt(rangeStr, 10);
	}
}

