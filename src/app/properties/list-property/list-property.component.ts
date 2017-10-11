import { NotificationsService } from './../../shared/notifications/notifications.service';
import { AuthenticationService } from './../../authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Message } from 'primeng/primeng';
import { SelectItem } from 'primeng/components/common/selectitem';

@Component({
	selector: 'app-list-property',
	templateUrl: './list-property.component.html',
	styleUrls: ['./list-property.component.scss']
})
export class ListPropertyComponent extends ErrorsDecoratableComponent implements OnInit {
	public isUserAnonymous: boolean;
	public hasLoaded: boolean;
	public listPropertyForm: FormGroup;
	public propertyTypes: SelectItem[];
	public currencies: SelectItem[];

	msgs: Message[];

	uploadedFiles: any[] = [];

	constructor(private formBuilder: FormBuilder,
		private authService: AuthenticationService,
		errorsService: ErrorsService,
		translateService: TranslateService,
		private notificationService: NotificationsService) {
		super(errorsService, translateService);

		this.propertyTypes = [];
		this.propertyTypes.push({ label: 'Select Type', value: null });
		this.propertyTypes.push({ label: 'SingleFamilyHome', value: 1 });
		this.propertyTypes.push({ label: 'Apartment', value: 2 });
		this.propertyTypes.push({ label: 'Townhouse', value: 3 });
		this.propertyTypes.push({ label: 'Condo', value: 4 });
		this.propertyTypes.push({ label: 'Coop', value: 5 });
		this.propertyTypes.push({ label: 'Loft', value: 6 });
		this.propertyTypes.push({ label: 'TIC', value: 7 });
		this.propertyTypes.push({ label: 'Villa', value: 8 });
		this.propertyTypes.push({ label: 'SummerVilla', value: 9 });
		this.propertyTypes.push({ label: 'DevelopmentOnly', value: 10 });
		this.propertyTypes.push({ label: 'Studio', value: 11 });
		this.propertyTypes.push({ label: 'Maisonette', value: 12 });
		this.propertyTypes.push({ label: 'Penthouse', value: 13 });
		this.propertyTypes.push({ label: 'Bungalow', value: 14 });
		this.propertyTypes.push({ label: 'StudentRoom', value: 15 });

		this.currencies = [];
		this.currencies.push({ label: 'USD', value: 1 });
		this.currencies.push({ label: 'EUR', value: 2 });
		this.currencies.push({ label: 'RUB', value: 3 });
		this.currencies.push({ label: 'AED', value: 4 });
		this.currencies.push({ label: 'HKD', value: 5 });
		this.currencies.push({ label: 'SGD', value: 6 });
		this.currencies.push({ label: 'GBP', value: 7 });
		this.currencies.push({ label: 'BGN', value: 8 });
		this.currencies.push({ label: 'CNY', value: 9 });

		this.listPropertyForm = this.formBuilder.group({
			propertyType: ['', Validators.required],
			furnished: [''],
			price: ['', Validators.required],
			currency: ['1', Validators.required],
			year: [''],
		});
	}

	public get propertyType() {
		return this.listPropertyForm.get('propertyType');
	}

	public get furnished() {
		return this.listPropertyForm.get('furnished');
	}

	public get price() {
		return this.listPropertyForm.get('price');
	}

	public get currency() {
		return this.listPropertyForm.get('currency');
	}

	public get year() {
		return this.listPropertyForm.get('year');
	}

	async ngOnInit() {
		this.notificationService.pushInfo({
			title: 'Loading...',
			message: '',
			time: (new Date().getTime()),
			timeout: 15000
		});
		const result = await this.authService.isUserAnyonymous();
		this.isUserAnonymous = result;
		this.hasLoaded = true;
		this.notificationService.pushSuccess({
			title: 'Account Loaded...',
			message: '',
			time: (new Date().getTime()),
			timeout: 1500
		});
	}

	myUploader(event) {
		console.log(event);

		const blob = event.files[0]; // .objectURL.changingThisBreaksApplicationSecurity;
		console.log(blob);

		const reader = new FileReader();

		reader.readAsDataURL(blob);
		reader.onloadend = function () {
			const base64data = reader.result;
			console.log(base64data);
		};
	}

	public onSubmit() {
		console.log(this.propertyType);
		console.log(this.furnished);
		console.log(this.price);
		console.log(this.currency);
	}
}
