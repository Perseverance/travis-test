import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';

@Component({
	selector: 'app-preferences',
	templateUrl: './preferences.component.html',
	styleUrls: ['./preferences.component.scss'],
	encapsulation: ViewEncapsulation.None

})
export class PreferencesComponent implements OnInit {
	public subscriptionsPropertyForm: FormGroup;
	constructor(private formBuilder: FormBuilder) {
		this.subscriptionsPropertyForm = this.formBuilder.group({
			notifications: [''],
			newsletter: [{ value: '', disabled: true }],
		});
	}

	ngOnInit() {
	}
	public get notifications() {
		return this.subscriptionsPropertyForm.get('notifications');
	}
	public get newsletter() {
		return this.subscriptionsPropertyForm.get('newsletter');
	}
	public saveChanges() {
		const request = {
			notifications: (this.notifications.value),
			newsletter: (this.newsletter.value)
		};

	}

}
