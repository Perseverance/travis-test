import {NotificationsService} from './../../shared/notifications/notifications.service';
import {AuthenticationService} from './../../authentication/authentication.service';
import {TranslateService} from '@ngx-translate/core';
import {ErrorsService} from './../../shared/errors/errors.service';
import {ErrorsDecoratableComponent} from './../../shared/errors/errors.decoratable.component';
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';

interface PropertyImage {
	name: string;
	file: string;
}

@Component({
	selector: 'app-list-property',
	templateUrl: './list-property.component.html',
	styleUrls: ['./list-property.component.scss']
})
export class ListPropertyComponent extends ErrorsDecoratableComponent implements OnInit {
	public isUserAnonymous: boolean;
	public hasLoaded: boolean;
	public listPropertyForm: FormGroup;
	public selectedImages = [];
	public propertyImages: object[] = new Array<PropertyImage>();

	constructor(private formBuilder: FormBuilder,
				private authService: AuthenticationService,
				errorsService: ErrorsService,
				translateService: TranslateService,
				private notificationService: NotificationsService) {
		super(errorsService, translateService);

		this.listPropertyForm = this.formBuilder.group({});
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

	public selectFile(event) {
		if (event.files[0]) {
			this.selectedImages.push(event.files[0]);
		}
	}

	public removeFile(event) {
		const idx = this.selectedImages.indexOf(event.file);
		this.selectedImages.splice(idx, 1);
		console.log(this.selectedImages);
	}

	public async submitProperty() {
		await this.prepareImages();
		// ToDO: submit logic
		this.propertyImages = [];
	}

	public async prepareImages() {
		for (const img of this.selectedImages) {
			const imageName = img.name;

			const base64 = await this.convertToBase64(img);

			const currentImageObj: PropertyImage = {
				name: imageName,
				file: base64
			};

			this.propertyImages.push(currentImageObj);
		}
	}

	public async convertToBase64(img): Promise<string> {
		let base64data;

		const base64 = await(new Promise<string>((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = function () {
				base64data = reader.result;
				resolve(base64data);
			};

			reader.readAsDataURL(img);
		}));
		return base64;
	}
}
