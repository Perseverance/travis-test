import {Component, OnInit, Input, ViewEncapsulation} from '@angular/core';
import {PROPERTY_THEMES} from '../../shared/new-property-component/new-property-component.component';

enum LIST_TYPES {
	GRID = 'grid',
	LIST = 'list'
}

@Component({
	selector: 'app-properties-list',
	templateUrl: './properties-list.component.html',
	styleUrls: ['./properties-list.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PropertiesListComponent implements OnInit {

	@Input() properties: any[];
	public theme = LIST_TYPES.GRID;
	public cardsTheme = PROPERTY_THEMES.SMALL;
	public modes: any[];
	public listMode = LIST_TYPES.GRID;
	public filterSelectionActivated = false;
	public defaultPriceMaxRange = 5000000;
	public priceMinRange = 0;
	public priceMaxRange = 5000000;
	public priceStep = 100000;
	public priceRangeValue: number[] = [this.priceMinRange, this.priceMaxRange];

	constructor() {
		this.modes = [
			{label: '', value: LIST_TYPES.GRID},
			{label: '', value: LIST_TYPES.LIST}
		];
	}

	ngOnInit() {
	}

	private setThemeGrid() {
		this.theme = LIST_TYPES.GRID;
		this.cardsTheme = PROPERTY_THEMES.SMALL;
	}

	private setThemeList() {
		this.theme = LIST_TYPES.LIST;
		this.cardsTheme = PROPERTY_THEMES.BIG;
	}

	public onModeSwitched(selectedMode) {
		switch (selectedMode) {
			case LIST_TYPES.GRID:
				this.setThemeGrid();
				break;
			case LIST_TYPES.LIST:
				this.setThemeList();
				break;
		}
	}

	public toggleFilterSelectionClass() {
		this.filterSelectionActivated = !this.filterSelectionActivated;
	}

	public changePriceMinRangeInput(event) {
		let inputMinValue = parseInt(event, 10);
		this.priceRangeValue = [];
		if (inputMinValue > this.priceMaxRange) {
			inputMinValue = this.priceMaxRange;
		}
		this.priceRangeValue = [inputMinValue, this.priceMaxRange];
	}

	public changePriceMaxRangeInput(event) {
		let inputMaxValue = parseInt(event, 10);
		this.priceRangeValue = [];
		if (inputMaxValue < this.priceMinRange) {
			inputMaxValue = this.priceMinRange;
		}
		this.priceRangeValue = [this.priceMinRange, inputMaxValue];
	}

	public handlePriceChange(event) {
		this.priceMinRange = event.values[0];
		this.priceMaxRange = event.values[1];
	}

	public applyPriceFilter(overlay) {
		// ToDo: Apply filter call
		console.log(this.priceMinRange);
		console.log(this.priceMaxRange);
		overlay.hide();
	}
}
