import {PropertiesFilter} from './../../properties/properties.service';
import {SelectItem} from 'primeng/primeng';
import {Component, OnInit, Input, ViewEncapsulation, Output, EventEmitter} from '@angular/core';
import {PROPERTY_THEMES} from '../../shared/new-property-component/new-property-component.component';

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
	public filterSelectionActivated = false;

	@Output() onFilterChanged = new EventEmitter<PropertiesFilter>();

	constructor() {
		this.modes = [
			{label: '', value: LIST_TYPES.GRID},
			{label: '', value: LIST_TYPES.LIST}
		];
		this.sortingTypes = [
			{label: 'Default Sorting', value: SORTING_TYPES.DEFAULT},
			{label: 'Most Recent', value: SORTING_TYPES.RECENT},
			{label: 'Price (Low to High)', value: SORTING_TYPES.LOWEST},
			{label: 'By Area', value: SORTING_TYPES.BY_AREA}
		];
	}

	ngOnInit() {
	}

	public onChange() {
		this.onFilterChanged.emit({sorting: this.sortingType});
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
}
