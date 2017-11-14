import { Component, OnInit } from '@angular/core';
import {Jsonp} from '@angular/http';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
	selector: 'app-newsletter',
	templateUrl: './newsletter.component.html',
	styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

	public sendMailChimpForm: FormGroup;
	constructor(private formBuilder: FormBuilder) {
		this.sendMailChimpForm = this.formBuilder.group({
			email: ['', []]
		});
	}

	ngOnInit() {
	}
}
