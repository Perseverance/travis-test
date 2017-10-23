import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PropertiesService} from '../../properties/properties.service';
import {GetNewProperties, NewPropertyHome} from '../../properties/properties-responses';
import {SelectItem} from 'primeng/primeng';
import {Router} from '@angular/router';

@Component({
	selector: 'app-new-properties',
	templateUrl: './new-properties.component.html',
	styleUrls: ['./new-properties.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class NewPropertiesComponent implements OnInit {
	public newProperties: GetNewProperties[];
	public citiesOptions: SelectItem[];
	public selectedCity = 0;
	public properties: NewPropertyHome[];

	constructor(private propertiesService: PropertiesService,
				private router: Router) {
	}

	async ngOnInit() {
		this.newProperties = await this.propertiesService.getNewProperties();
		console.log(this.newProperties);
		this.citiesOptions = [];
		this.newProperties.forEach((item, index) => {
			this.citiesOptions.push({value: index, label: item.locationName});
		});
		this.properties = this.newProperties[this.selectedCity].properties;
	}

	public cityChanged(event) {
		this.properties = new Array<NewPropertyHome>();
		this.properties = this.newProperties[event.value].properties;
	}

	public propertySelected(id: string) {
		console.log(id);
		this.router.navigate(['property', id]);
	}
}
