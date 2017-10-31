import { Component, OnInit, Input } from '@angular/core';

enum LIST_TYPES {
	GRID = 'grid',
	LIST = 'list'
}

@Component({
	selector: 'app-properties-list',
	templateUrl: './properties-list.component.html',
	styleUrls: ['./properties-list.component.scss']
})
export class PropertiesListComponent implements OnInit {

	@Input() properties: any[];
	public theme = LIST_TYPES.GRID;
	public cardsTheme = 'small';

	constructor() { }

	ngOnInit() {
	}

	public setThemeGrid() {
		this.theme = LIST_TYPES.GRID;
		this.cardsTheme = 'small';
	}

	public setThemeList() {
		this.theme = LIST_TYPES.LIST;
		this.cardsTheme = 'big';
	}

}
