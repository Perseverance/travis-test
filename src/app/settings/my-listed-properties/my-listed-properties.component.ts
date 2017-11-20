import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {PropertiesService} from '../../properties/properties.service';
import {ConfirmationService, Message} from 'primeng/primeng';

@Component({
	selector: 'app-my-listed-properties',
	templateUrl: './my-listed-properties.component.html',
	styleUrls: ['./my-listed-properties.component.scss']
})
export class MyListedPropertiesComponent implements OnInit {
	public myListedProperties;
	public messages: Message[] = [];

	constructor(private propertiesService: PropertiesService,
				private confirmationService: ConfirmationService) {
	}

	async ngOnInit() {
		this.myListedProperties = await this.propertiesService.getMyListedProperties();
		console.log(this.myListedProperties);
	}

	public markPropertyAsSold(id: string) {
		this.confirmationService.confirm({
			message: 'Are you sure that you want to proceed?',
			header: 'Confirmation',
			icon: 'fa fa-question-circle',
			accept: async () => {
				const result = await this.propertiesService.markPropertyAsSold(id);
				if (result) {
					this.messages = [{severity: 'info', summary: 'Confirmed', detail: 'You have accepted'}];
				}
			},
			reject: () => {
				this.messages = [{severity: 'info', summary: 'Rejected', detail: 'You have rejected'}];
			}
		});
	}

}
