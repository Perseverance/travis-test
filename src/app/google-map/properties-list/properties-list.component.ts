import {TranslateService} from '@ngx-translate/core';
import {PropertiesFilter} from './../../properties/properties.service';
import {SelectItem} from 'primeng/primeng';
import {Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import {PROPERTY_THEMES} from '../../shared/property-preview/property-preview.component';

enum LIST_TYPES {
	GRID = 'grid',
	LIST = 'list'
}

export enum SORTING_TYPES {
	DEFAULT = undefined,
	RECENT = 0,
	LOWEST = 1,
	BY_AREA = 2
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
	public sortingTypes: SelectItem[];
	public sortingType = SORTING_TYPES.DEFAULT;
	public priceFilterMinValue = undefined;
	public priceFilterMaxValue = undefined;
	public priceFilterCurrency = undefined;
	public areaFilterMinValue = undefined;
	public areaFilterMaxValue = undefined;
	public areaFilterUnit = undefined;
	public selectedBedTypes = undefined;
	public filterPriceSelectionActivated = false;
	public filterAreaSelectionActivated = false;
	public filterBedSelectionActivated = false;

	public IMAGE_WIDTH: number;
	public IMAGE_HEIGHT: number;

	private SMALL_IMAGE_WIDTH = 360;
	private SMALL_IMAGE_HEIGHT = 215;
	private BIG_IMAGE_WIDTH = 600;
	private BIG_IMAGE_HEIGHT = 360;

	@Output() onFilterChanged = new EventEmitter<PropertiesFilter>();

	constructor(private translateService: TranslateService) {
		this.modes = [
			{label: '', value: LIST_TYPES.GRID},
			{label: '', value: LIST_TYPES.LIST}
		];

		const self = this;
		this.translateService.get(['sorting.default', 'sorting.recent', 'sorting.price', 'sorting.area'])
			.subscribe((data) => {
				self.sortingTypes = [
					{label: data['sorting.default'], value: SORTING_TYPES.DEFAULT},
					{label: data['sorting.recent'], value: SORTING_TYPES.RECENT},
					{label: data['sorting.price'], value: SORTING_TYPES.LOWEST},
					{label: data['sorting.area'], value: SORTING_TYPES.BY_AREA}
				];
			});

		if (this.cardsTheme === PROPERTY_THEMES.SMALL) {
			this.IMAGE_HEIGHT = this.SMALL_IMAGE_HEIGHT;
			this.IMAGE_WIDTH = this.SMALL_IMAGE_WIDTH;
		}

		if (this.cardsTheme === PROPERTY_THEMES.BIG) {
			this.IMAGE_HEIGHT = this.BIG_IMAGE_HEIGHT;
			this.IMAGE_WIDTH = this.BIG_IMAGE_WIDTH;
		}

	}

	ngOnInit() {
	}

	public onChange() {
		this.onFilterChanged.emit({
			sorting: this.sortingType,
			priceFilter: {
				minValue: this.priceFilterMinValue,
				maxValue: this.priceFilterMaxValue,
				currency: this.priceFilterCurrency
			},
			areaFilter: {
				minValue: this.areaFilterMinValue,
				maxValue: this.areaFilterMaxValue,
				areaUnit: this.areaFilterUnit
			},
			bedFilter: this.selectedBedTypes
		});
	}

	private setThemeGrid() {
		this.theme = LIST_TYPES.GRID;
		this.cardsTheme = PROPERTY_THEMES.SMALL;
		this.IMAGE_HEIGHT = this.SMALL_IMAGE_HEIGHT;
		this.IMAGE_WIDTH = this.SMALL_IMAGE_WIDTH;
	}

	private setThemeList() {
		this.theme = LIST_TYPES.LIST;
		this.cardsTheme = PROPERTY_THEMES.BIG;
		this.IMAGE_HEIGHT = this.BIG_IMAGE_HEIGHT;
		this.IMAGE_WIDTH = this.BIG_IMAGE_WIDTH;
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

	public onFilterPriceActivated(event: boolean) {
		this.filterPriceSelectionActivated = event;
	}

	public onFilterAreaActivated(event: boolean) {
		this.filterAreaSelectionActivated = event;
	}

	public onFilterBedActivated(event: boolean) {
		this.filterBedSelectionActivated = event;
	}

	public onPriceFilterApplied(event: PropertiesFilter) {
		this.priceFilterCurrency = event.priceFilter.currency;
		this.priceFilterMinValue = event.priceFilter.minValue;
		this.priceFilterMaxValue = event.priceFilter.maxValue;
		this.onFilterChanged.emit({
			sorting: this.sortingType,
			priceFilter: {
				minValue: this.priceFilterMinValue,
				maxValue: this.priceFilterMaxValue,
				currency: this.priceFilterCurrency
			},
			areaFilter: {
				minValue: this.areaFilterMinValue,
				maxValue: this.areaFilterMaxValue,
				areaUnit: this.areaFilterUnit
			},
			bedFilter: this.selectedBedTypes
		});
	}

	public onAreaFilterApplied(event: PropertiesFilter) {
		this.areaFilterUnit = event.areaFilter.areaUnit;
		this.areaFilterMinValue = event.areaFilter.minValue;
		this.areaFilterMaxValue = event.areaFilter.maxValue;
		this.onFilterChanged.emit({
			sorting: this.sortingType,
			priceFilter: {
				minValue: this.priceFilterMinValue,
				maxValue: this.priceFilterMaxValue,
				currency: this.priceFilterCurrency
			},
			areaFilter: {
				minValue: this.areaFilterMinValue,
				maxValue: this.areaFilterMaxValue,
				areaUnit: this.areaFilterUnit
			},
			bedFilter: this.selectedBedTypes
		});
	}

	public onBedFilterApplied(event: PropertiesFilter) {
		this.selectedBedTypes = event.bedFilter;
		this.onFilterChanged.emit({
			sorting: this.sortingType,
			priceFilter: {
				minValue: this.priceFilterMinValue,
				maxValue: this.priceFilterMaxValue,
				currency: this.priceFilterCurrency
			},
			areaFilter: {
				minValue: this.areaFilterMinValue,
				maxValue: this.areaFilterMaxValue,
				areaUnit: this.areaFilterUnit
			},
			bedFilter: this.selectedBedTypes
		});
	}

	public isAppliedPriceFilter(): boolean {
		if (this.priceFilterMinValue === undefined || this.priceFilterMaxValue === undefined || this.priceFilterCurrency === undefined) {
			return false;
		}
		return true;
	}

	public isAppliedBedsFilter(): boolean {
		if (this.selectedBedTypes === undefined || this.selectedBedTypes === '') {
			return false;
		}
		return true;
	}

	public isAppliedAreaFilter(): boolean {
		if (this.areaFilterUnit === undefined || this.areaFilterMinValue === undefined || this.areaFilterMaxValue === undefined) {
			return false;
		}
		return true;
	}
}
