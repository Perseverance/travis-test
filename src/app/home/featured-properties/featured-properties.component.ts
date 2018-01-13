import { Component, OnInit } from '@angular/core';
import { Jsonp } from '@angular/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoogleAnalyticsEventsService } from '../../shared/google-analytics.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-featured-properties',
	templateUrl: './featured-properties.component.html',
	styleUrls: ['./featured-properties.component.scss']
})
export class FeaturedPropertiesComponent implements OnInit {

	public sendMailChimpForm: FormGroup;
	constructor(private router: Router,
		private formBuilder: FormBuilder,
		private googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
		this.sendMailChimpForm = this.formBuilder.group({
			email: ['', []]
		});
	}

	ngOnInit() {
	}	

	public packerHouseClicked() {
		this.googleAnalyticsEventsService.emitEvent('page-featured-listings', 'packer');

		this.router.navigate(['property', 'packer-house']);
	}
}
