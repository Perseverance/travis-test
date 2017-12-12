import { DeedsService } from './../../../shared/deeds.service';
import { Component, OnInit, Input } from '@angular/core';
import { LoadPropertyService } from '../../load-property.service';
import { PropertiesService } from '../../../properties/properties.service';
import { CurrencyTypeEnum } from '../../../shared/enums/currency-type.enum';

@Component({
	selector: 'app-property-item-view',
	templateUrl: './property-item-view.component.html',
	styleUrls: ['./property-item-view.component.scss']
})
export class PropertyItemViewComponent implements OnInit {
	public property: any;
	@Input() deedId;
	constructor(private propertiesService: PropertiesService,
		private deedsService: DeedsService) { }

	async ngOnInit() {
		const deed = await this.deedsService.getDeedDetails(this.deedId);
		const result = await this.propertiesService.getProperty(deed.propertyId, CurrencyTypeEnum.ETH);
		this.property = result;
	}

}