import { Component, OnInit } from '@angular/core';
import { PropertiesService } from '../../properties/properties.service';
import { ConfirmationService, Message } from 'primeng/primeng';
import { PropertyStatusEnum } from '../../shared/enums/property-status.enum';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Component({
	selector: 'app-my-listed-properties',
	templateUrl: './my-listed-properties.component.html',
	styleUrls: ['./my-listed-properties.component.scss']
})
export class MyListedPropertiesComponent implements OnInit {
	public myListedProperties;
	public messages: Message[] = [];
	public confirmationLabels: object;
	public growlLabels: object;
	public propertyStatusEnum = PropertyStatusEnum;

	constructor(private propertiesService: PropertiesService,
		private confirmationService: ConfirmationService,
		private translateService: TranslateService,
		private notificationService: NotificationsService) {
	}

	async ngOnInit() {
		this.myListedProperties = await this.propertiesService.getMyListedProperties();

		this.translateService.stream([
			'settings.my-listed-properties-settings.confirmation-heading',
			'settings.my-listed-properties-settings.confirmation-message',
			'settings.my-listed-properties-settings.confirmation-message-unlist',
			'settings.my-listed-properties-settings.growl-heading',
			'settings.my-listed-properties-settings.growl-message',
			'settings.my-listed-properties-settings.growl-message-unlist'

		]).subscribe((translations) => {
			this.confirmationLabels = {
				heading: translations['settings.my-listed-properties-settings.confirmation-heading'],
				message: translations['settings.my-listed-properties-settings.confirmation-message'],
				messageUnlist: translations['settings.my-listed-properties-settings.confirmation-message-unlist']
			};
			this.growlLabels = {
				heading: translations['settings.my-listed-properties-settings.growl-heading'],
				message: translations['settings.my-listed-properties-settings.growl-message'],
				messageUnlist: translations['settings.my-listed-properties-settings.growl-message-unlist']
			};
		});
	}

	public markPropertyAsSold(id: string) {
		this.confirmationService.confirm({
			message: this.confirmationLabels['message'],
			header: this.confirmationLabels['heading'],
			key: 'markAsSoldDialog',
			accept: () => this.acceptMarkupPropertyAsSold(id)
		});
	}

	private async acceptMarkupPropertyAsSold(id: string) {
		const result = await this.propertiesService.markPropertyAsSold(id);
		if (!result) {
			return;
		}
		this.findAndMarkPropertyAsSold(id);
		this.notificationService.pushSuccess({
			title: this.growlLabels['message'],
			message: '',
			time: (new Date().getTime()),
			timeout: 2000
		});
		this.messages = [{
			severity: 'success',
			summary: this.growlLabels['heading'],
			detail: this.growlLabels['message']
		}];
	}

	private findAndMarkPropertyAsSold(id: string) {
		for (let i = 0; i < this.myListedProperties.length; i++) {
			const property = this.myListedProperties[i];
			if (property.id === id) {
				this.myListedProperties[i].status = this.propertyStatusEnum.Sold;
				break;
			}
		}
	}

	public markPropertyAsUnlisted(id: string) {
		this.confirmationService.confirm({
			message: this.confirmationLabels['messageUnlist'],
			header: this.confirmationLabels['heading'],
			key: 'markAsUnlistDialog',
			accept: () => this.acceptMarkPropertyAsUnlisted(id)
		});
	}

	private async acceptMarkPropertyAsUnlisted(id: string) {
		const result = await this.propertiesService.markPropertyAsUnlisted(id);
		if (!result) {
			return;
		}
		this.findAndMarkPropertyAsUnlisted(id);
		this.notificationService.pushSuccess({
			title: this.growlLabels['messageUnlist'],
			message: '',
			time: (new Date().getTime()),
			timeout: 2000
		});
		this.messages = [{
			severity: 'success',
			summary: this.growlLabels['heading'],
			detail: this.growlLabels['messageUnlist']
		}];
	}

	private findAndMarkPropertyAsUnlisted(id: string) {
		for (let i = 0; i < this.myListedProperties.length; i++) {
			const property = this.myListedProperties[i];
			if (property.id === id) {
				this.myListedProperties[i].status = this.propertyStatusEnum.Unlisted;
				break;
			}
		}
	}
}
