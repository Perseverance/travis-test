import { TranslateService } from '@ngx-translate/core';
import { PropertiesFilter } from './../../properties/properties.service';
import { SelectItem } from 'primeng/primeng';
import { Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter } from '@angular/core';
import { PROPERTY_THEMES } from '../../shared/new-property-component/new-property-component.component';

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
	public filterSelectionActivated = false;

	@Output() onFilterChanged = new EventEmitter<PropertiesFilter>();

	constructor(private translateService: TranslateService) {
		this.modes = [
			{ label: '', value: LIST_TYPES.GRID },
			{ label: '', value: LIST_TYPES.LIST }
		];

		const self = this;
		this.translateService.get(['sorting.default', 'sorting.recent', 'sorting.price', 'sorting.area'])
			.subscribe((data) => {
				self.sortingTypes = [
					{ label: data['sorting.default'], value: SORTING_TYPES.DEFAULT },
					{ label: data['sorting.recent'], value: SORTING_TYPES.RECENT },
					{ label: data['sorting.price'], value: SORTING_TYPES.LOWEST },
					{ label: data['sorting.area'], value: SORTING_TYPES.BY_AREA }
				];
			});
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
			}
		});
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

	public onFilterActivated(event: boolean) {
		this.filterSelectionActivated = event;
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
			}
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
			}
		});
	}
}
