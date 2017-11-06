import {Component, EventEmitter, OnInit, Output, ViewEncapsulation} from '@angular/core';
import {SelectItem} from 'primeng/primeng';
import {TranslateService} from '@ngx-translate/core';
import {PropertiesFilter} from '../../../properties/properties.service';

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
	public bedOptions: SelectItem[];
	public selectedBedTypes: string[];
	public label_studio: string;
	public label_1_bed: string;
	public label_2_beds: string;
	public label_3_beds: string;
	public label_4_beds: string;
	public filterSelectionActivated = false;
	@Output() onFilterActivated = new EventEmitter<boolean>();
	@Output() onBedFilterApplied = new EventEmitter<PropertiesFilter>();

	constructor(private translateService: TranslateService) {
		this.bedOptions = [];

		this.translateService.stream(this.STUDIO_KEY).subscribe((keyTranslation: string) => {
			this.label_studio = keyTranslation;
			this.bedOptions.push({label: this.label_studio, value: this.BED_OPTION_STUDIO});
		});

		this.translateService.stream(this.BED_1_KEY).subscribe((keyTranslation: string) => {
			this.label_1_bed = keyTranslation;
			this.bedOptions.push({label: this.label_1_bed, value: this.BED_OPTION_1_BED});
		});

		this.translateService.stream(this.BEDS_2_KEY).subscribe((keyTranslation: string) => {
			this.label_2_beds = keyTranslation;
			this.bedOptions.push({label: this.label_2_beds, value: this.BED_OPTION_2_BEDS});
		});

		this.translateService.stream(this.BEDS_3_KEY).subscribe((keyTranslation: string) => {
			this.label_3_beds = keyTranslation;
			this.bedOptions.push({label: this.label_3_beds, value: this.BED_OPTION_3_BEDS});
		});

		this.translateService.stream(this.BEDS_4_KEY).subscribe((keyTranslation: string) => {
			this.label_4_beds = keyTranslation;
			this.bedOptions.push({label: this.label_4_beds, value: this.BED_OPTION_4_PLUS_BEDS});
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
		console.log(this.selectedBedTypes.join());
		overlay.hide();
	}
}
