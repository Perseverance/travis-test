import { Component, OnInit } from '@angular/core';
import { Jsonp } from '@angular/http';
import { FormBuilder, FormGroup } from '@angular/forms';
import { GoogleAnalyticsEventsService } from '../../shared/google-analytics.service';

@Component({
	selector: 'app-newsletter',
	templateUrl: './newsletter.component.html',
	styleUrls: ['./newsletter.component.scss']
})
export class NewsletterComponent implements OnInit {

	public sendMailChimpForm: FormGroup;
	constructor(private formBuilder: FormBuilder,
		private googleAnalyticsEventsService: GoogleAnalyticsEventsService) {
		this.sendMailChimpForm = this.formBuilder.group({
			email: ['', []]
		});
	}

	ngOnInit() {
	}
	emitAnalyticsClickEvent() {
		this.googleAnalyticsEventsService.setPageViewEvent('page-subscribe', 'subscribe');
	}
}
