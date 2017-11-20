import { Component, EventEmitter, Input, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { SelectItem } from 'primeng/primeng';
import { TranslateService } from '@ngx-translate/core';
import { PropertiesFilter } from '../../../properties/properties.service';

@Component({
	selector: 'app-bed-filter',
	templateUrl: './bed-filter.component.html',
	styleUrls: ['./bed-filter.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class BedFilterComponent implements OnInit {
	private STUDIO_KEY = 'filters.beds.studio';
	private BED_1_KEY = 'filters.beds.1-bed';
	private BEDS_2_KEY = 'filters.beds.2-beds';
	private BEDS_3_KEY = 'filters.beds.3-beds';
	private BEDS_4_KEY = 'filters.beds.4-beds';
	private BED_OPTION_STUDIO = '0';
	private BED_OPTION_1_BED = '1';
	private BED_OPTION_2_BEDS = '2';
	private BED_OPTION_3_BEDS = '3';
	private BED_OPTION_4_PLUS_BEDS = '4p';
	public bedOptions: SelectItem[] = [];
	public selectedBedTypes: string[];
	public filterSelectionActivated = false;
	@Input() bedsFilterApplied: boolean;
	@Output() onFilterActivated = new EventEmitter<boolean>();
	@Output() onBedFilterApplied = new EventEmitter<PropertiesFilter>();

	constructor(private translateService: TranslateService) {
		const self = this;
		this.translateService.get([this.STUDIO_KEY, this.BED_1_KEY, this.BEDS_2_KEY, this.BEDS_3_KEY, this.BEDS_4_KEY])
			.subscribe((data) => {
				self.bedOptions = [
					{ label: data[this.STUDIO_KEY], value: self.BED_OPTION_STUDIO },
					{ label: data[this.BED_1_KEY], value: self.BED_OPTION_1_BED },
					{ label: data[this.BEDS_2_KEY], value: self.BED_OPTION_2_BEDS },
					{ label: data[this.BEDS_3_KEY], value: self.BED_OPTION_3_BEDS },
					{ label: data[this.BEDS_4_KEY], value: self.BED_OPTION_4_PLUS_BEDS }
				];
			});
	}

	ngOnInit() {
	}

	public toggleFilterSelectionClass() {
		this.filterSelectionActivated = !this.filterSelectionActivated;
		this.onFilterActivated.emit(this.filterSelectionActivated);
	}

	public applyBedFilter(overlay) {
		this.onBedFilterApplied.emit({
			bedFilter: this.selectedBedTypes.join()
		});
		overlay.hide();
	}

	public resetForm() {
		this.selectedBedTypes = [];
		this.filterSelectionActivated = false;
	}
}
