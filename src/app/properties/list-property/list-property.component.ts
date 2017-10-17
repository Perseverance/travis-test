import { CreatePropertyResponse, PropertyImage } from './../properties-responses';
import { PropertiesService } from './../properties.service';
import { NotificationsService } from './../../shared/notifications/notifications.service';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectItem } from 'primeng/components/common/selectitem';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { LocationSearchComponent } from '../../location-search/location-search.component';

@Component({
	selector: 'app-list-property',
	templateUrl: './list-property.component.html',
	styleUrls: ['./list-property.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class ListPropertyComponent extends ErrorsDecoratableComponent implements OnInit {
	public listPropertyForm: FormGroup;
	public propertyTypes: SelectItem[];
	public currencies: SelectItem[];
	public areaUnits: SelectItem[];
	public uploadControl: any;

	public selectedImages = [];

	public isSubmitClicked = false;

	public hasUserLoaded = false;
	public isUserAnonymous: boolean;

	private DEFAULT_COMMISION_FEE = 75;

	private SELECT_TYPE_KEY = 'list-property.form-fields.select-type';

	@ViewChild(LocationSearchComponent)
	private locationSearchComponent: LocationSearchComponent;

	constructor(private formBuilder: FormBuilder,
		private authService: AuthenticationService,
		errorsService: ErrorsService,
		translateService: TranslateService,
		private notificationService: NotificationsService,
		private propertiesService: PropertiesService) {
		super(errorsService, translateService);

		this.propertyTypes = [];
		this.propertyTypes.push({ label: '', value: null });
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
		this.currencies.push({ label: 'ETH', value: 10 });
		this.currencies.push({ label: 'BTC', value: 11 });

		this.areaUnits = [];
		this.areaUnits.push({ label: 'sqm', value: 1 });
		this.areaUnits.push({ label: 'sqft', value: 2 });

		this.listPropertyForm = this.formBuilder.group({
			propertyType: ['', Validators.required],
			furnished: [''],
			price: ['', Validators.required],
			acceptedCurrencies: [[], Validators.required],
			commisionFee: [this.DEFAULT_COMMISION_FEE],
			currency: ['1', Validators.required],
			year: [''],
			bedrooms: [''],
			floor: [''],
			area: [''],
			areaUnit: ['1'],
			description: [''],
			address: ['', Validators.required],
			propertyLat: ['', Validators.required],
			propertyLon: ['', Validators.required],
			propertyImages: ['', [Validators.required, Validators.minLength(1)]],
			TOC: [false, [Validators.requiredTrue]]
		});

		this.translateService.stream(this.SELECT_TYPE_KEY).subscribe((keyTranslation: string) => {
			this.propertyTypes[0].label = keyTranslation;
		});

		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				this.isUserAnonymous = userInfo.isAnonymous;
				this.hasUserLoaded = true;
			}
		});
	}

	async ngOnInit() {
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

	public get acceptedCurrencies() {
		return this.listPropertyForm.get('acceptedCurrencies');
	}

	public get commisionFee() {
		return this.listPropertyForm.get('commisionFee');
	}

	public get feeDecimal() {
		return this.commisionFee.value / 10;
	}

	public get year() {
		return this.listPropertyForm.get('year');
	}

	public get yearInListingFormat() {
		const yearBuilt = this.year.value;
		return `01-01-${yearBuilt}`;
	}

	public get bedrooms() {
		return this.listPropertyForm.get('bedrooms');
	}

	public get floor() {
		return this.listPropertyForm.get('floor');
	}

	public get area() {
		return this.listPropertyForm.get('area');
	}

	public get areaUnit() {
		return this.listPropertyForm.get('areaUnit');
	}

	public get description() {
		return this.listPropertyForm.get('description');
	}

	public get language() {
		return this.listPropertyForm.get('language');
	}

	public get address() {
		return this.listPropertyForm.get('address');
	}

	public get propertyLat() {
		return this.listPropertyForm.get('propertyLat');
	}

	public get propertyLon() {
		return this.listPropertyForm.get('propertyLon');
	}

	public get propertyImages() {
		return this.listPropertyForm.get('propertyImages');
	}

	public get TOC() {
		return this.listPropertyForm.get('TOC');
	}

	public selectFile(event, uploadControl) {
		for (const file of event.files) {
			this.selectedImages.push(file);
		}

		this.uploadControl = uploadControl;
	}

	public removeFile(event) {
		const idx = this.selectedImages.indexOf(event.file);
		this.selectedImages.splice(idx, 1);
	}

	public async prepareImages() {
		const preparedImages = new Array<PropertyImage>();
		for (const img of this.selectedImages) {
			const imageName = img.name;

			try {
				const base64 = await this.convertToBase64(img);
				const currentImageObj: PropertyImage = {
					name: imageName,
					file: base64
				};
				preparedImages.push(currentImageObj);
			} catch (error) {
				// Should not stop on one unsuccessfull convertion
				continue;
			}
		}

		if (preparedImages.length === 0) {
			throw new Error('No usable property image was uploaded');
		}

		this.propertyImages.setValue(preparedImages);
	}

	public async convertToBase64(img): Promise<string> {
		const self = this;
		const base64 = await (new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = function () {
				const base64dataWithHeaders = reader.result;

				// The reader normally adds something like this before the base64 - 'data:image/jpeg;base64,'
				// it needs to be removed
				const base64dataWithoutHeaders = self.removeBase64Headers(base64dataWithHeaders);
				resolve(base64dataWithoutHeaders);
			};

			reader.readAsDataURL(img);
		}));
		return base64;
	}

	private removeBase64Headers(base64dataWithHeaders: string) {
		const base64Headers = 'base64,';
		const headerIndex = base64dataWithHeaders.indexOf(base64Headers);
		if (headerIndex === -1) {
			// Headers were not found, probably good to go
			return base64dataWithHeaders;
		}

		const base64DataStartsAt = headerIndex + base64Headers.length;
		return base64dataWithHeaders.substring(base64DataStartsAt);
	}

	@DefaultAsyncAPIErrorHandling('list-property.error-listing-property')
	public async onSubmit() {
		this.isSubmitClicked = true;
		if (this.selectedImages.length === 0) {
			// Cannot continue without selected images
			return;
		}
		try {
			await this.prepareImages();
		} catch (error) {
			// Cant continue without images
			this.errorsService.pushError({
				errorTitle: 'Error uploading images',
				errorMessage: 'No usable image found',
				errorTime: (new Date()).getTime()
			});
			return;
		}
		if (this.listPropertyForm.invalid) {
			return;
		}
		this.notificationService.pushInfo({
			title: 'Sending data...',
			message: '',
			time: (new Date().getTime()),
			timeout: 15000
		});
		const request = {
			bedrooms: this.bedrooms.value,
			furnished: (!!this.furnished.value),
			floor: this.floor.value,
			price: {
				value: this.price.value,
				type: this.currency.value
			},
			AcceptedCurrencies: this.acceptedCurrencies.value,
			CommissionFee: this.feeDecimal,
			latitude: this.propertyLat.value,
			longitude: this.propertyLon.value,
			size: {
				value: this.area.value,
				type: this.areaUnit.value
			},
			builtIn: this.yearInListingFormat,
			type: this.propertyType.value,
			description: this.description.value,
			address: this.address.value,
			status: 1
		};
		const result: CreatePropertyResponse = await this.propertiesService.createProperty(request);
		const propertyId = result.data;
		this.notificationService.pushInfo({
			title: 'Uploading images...',
			message: '',
			time: (new Date().getTime()),
			timeout: 15000
		});
		const imagesResult = await this.propertiesService.uploadPropertyImages(propertyId, this.propertyImages.value);

		this.notificationService.pushSuccess({
			title: 'Property Upload success',
			message: '',
			time: (new Date().getTime()),
			timeout: 2000
		});

		this.resetListingForm();
	}

	public onLocationFound(latitude: number, longitude: number, locationAddress: string) {
		this.propertyLat.setValue(latitude);
		this.propertyLon.setValue(longitude);
		this.address.setValue(locationAddress);
	}

	private resetListingForm() {
		this.isSubmitClicked = false;
		this.selectedImages = new Array<any>();
		this.uploadControl.clear();
		this.listPropertyForm.reset();
		this.currency.setValue('1'); // USD default
		this.areaUnit.setValue('1'); // sqm default
		this.commisionFee.setValue(this.DEFAULT_COMMISION_FEE)
		this.locationSearchComponent.resetInput();
	}
}
