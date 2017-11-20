import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../properties/properties.service';

@Component({
	selector: 'app-my-listed-properties',
	templateUrl: './my-listed-properties.component.html',
	styleUrls: ['./my-listed-properties.component.scss']
})
export class MyListedPropertiesComponent implements OnInit {
	public myListedProperties;

	constructor(private propertiesService: PropertiesService) {
	}

	async ngOnInit() {
		this.myListedProperties = await this.propertiesService.getMyListedProperties();
	}

}
