import {Component, OnInit} from '@angular/core';
import {PropertiesService} from '../../properties/properties.service';
import {ConfirmationService, Message} from 'primeng/primeng';
import {PropertyStatusEnum} from '../../shared/enums/property-status.enum';
import {TranslateService} from '@ngx-translate/core';

@Component({
	selector: 'app-my-listed-properties',
	templateUrl: './my-listed-properties.component.html',
	styleUrls: ['./my-listed-properties.component.scss']
})
export class MyListedPropertiesComponent implements OnInit {
	public myListedProperties;
	public messages: Message[] = [];
	public confirmationLabels: object;

	constructor(private propertiesService: PropertiesService,
				private confirmationService: ConfirmationService,
				private translateService: TranslateService) {
	}

	async ngOnInit() {
		this.myListedProperties = await this.propertiesService.getMyListedProperties();

		this.translateService.stream([
			'settings.my-listed-properties-settings.confirmation-heading',
			'settings.my-listed-properties-settings.confirmation-message'
		]).subscribe((translations) => {
			this.confirmationLabels = {
				heading: translations['settings.my-listed-properties-settings.confirmation-heading'],
				message: translations['settings.my-listed-properties-settings.confirmation-message']
			};
		});
	}

	public markPropertyAsSold(id: string) {
		this.confirmationService.confirm({
			message: this.confirmationLabels['message'],
			header: this.confirmationLabels['heading'],
			accept: async () => {
				const result = await this.propertiesService.markPropertyAsSold(id);
				if (result) {
					for (let i = 0; i < this.myListedProperties.length; i++) {
						const property = this.myListedProperties[i];
						if (property.id === id) {
							this.myListedProperties[i].status = PropertyStatusEnum.Sold;
							break;
						}
					}
					this.messages = [{severity: 'info', summary: 'Confirmed', detail: 'You have accepted'}];
				}
			},
			reject: () => {
			}
		});
	}

}
