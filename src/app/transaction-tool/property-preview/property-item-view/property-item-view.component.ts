import { DeedsService } from './../../../shared/deeds.service';
import { Component, OnInit, Input, SimpleChanges, SimpleChange } from '@angular/core';
import { LoadPropertyService } from '../../load-property.service';
import { PropertiesService } from '../../../properties/properties.service';
import { CurrencyTypeEnum } from '../../../shared/enums/currency-type.enum';
import { OnChanges } from '@angular/core/src/metadata/lifecycle_hooks';

@Component({
	selector: 'app-property-item-view',
	templateUrl: './property-item-view.component.html',
	styleUrls: ['./property-item-view.component.scss']
})
export class PropertyItemViewComponent implements OnInit, OnChanges {
	public property: any;
	public deed: any;
	@Input() deedId;
	private _deedId;
	constructor(private propertiesService: PropertiesService,
		private deedsService: DeedsService) { }

	ngOnInit() {
		this.loadComponentData(this.deedId);
	}

	ngOnChanges(changes: SimpleChanges) {
		const deedId: SimpleChange = changes.deedId;
		this._deedId = deedId.currentValue;
		this.loadComponentData(this._deedId);
	}

	public async loadComponentData(deedId) {
		const deed = await this.deedsService.getDeedDetails(this.deedId);
		this.deed = deed;
		const result = await this.propertiesService.getProperty(deed.propertyId, CurrencyTypeEnum.ETH);
		this.property = result;
	}
}