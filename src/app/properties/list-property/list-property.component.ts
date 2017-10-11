<<<<<<< HEAD
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ErrorsService} from '../../shared/errors/errors.service';
import {TranslateService} from '@ngx-translate/core';
import {ErrorsDecoratableComponent} from '../../shared/errors/errors.decoratable.component';
import {AuthenticationService} from '../../authentication/authentication.service';
import {Message} from 'primeng/primeng';
=======
import { NotificationsService } from './../../shared/notifications/notifications.service';
import { AuthenticationService } from './../../authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { Component, OnInit } from '@angular/core';
>>>>>>> sprint-boromir

@Component({
	selector: 'app-list-property',
	templateUrl: './list-property.component.html',
	styleUrls: ['./list-property.component.scss']
})
export class ListPropertyComponent extends ErrorsDecoratableComponent implements OnInit {
	public isUserAnonymous: boolean;
	public hasLoaded: boolean;
	public listPropertyForm: FormGroup;

	msgs: Message[];

<<<<<<< HEAD
	uploadedFiles: any[] = [];

	constructor(private formBuilder: FormBuilder,
				private authService: AuthenticationService,
				errorsService: ErrorsService,
				translateService: TranslateService) {
=======
	constructor(errorsService: ErrorsService,
		translateService: TranslateService,
		private authService: AuthenticationService,
		private notificationService: NotificationsService) {
>>>>>>> sprint-boromir
		super(errorsService, translateService);

		this.listPropertyForm = this.formBuilder.group({});
	}

	async ngOnInit() {
		this.notificationService.pushInfo({ title: 'Loading...', message: '', time: (new Date().getTime()), timeout: 15000 });
		const result = await this.authService.isUserAnyonymous();
		this.isUserAnonymous = result;
		this.hasLoaded = true;
		this.notificationService.pushSuccess({ title: 'Account Loaded...', message: '', time: (new Date().getTime()), timeout: 1500 });
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
}
