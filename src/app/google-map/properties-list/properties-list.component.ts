import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'app-properties-list',
	templateUrl: './properties-list.component.html',
	styleUrls: ['./properties-list.component.scss']
})
export class PropertiesListComponent implements OnInit {
	@Input() properties: any[];

	constructor() { }

	ngOnInit() {
	}

}
