import {Component, OnInit} from '@angular/core';
import {environment} from '../../environments/environment';

declare const HelloSign;

@Component({
	selector: 'app-hello-sign',
	templateUrl: './hello-sign.component.html',
	styleUrls: ['./hello-sign.component.scss']
})
export class HelloSignComponent implements OnInit {

	constructor() {
	}

	ngOnInit() {
		HelloSign.init(environment.helloSign.clientId);
		this.signDocument();
	}

	private signDocument() {
		HelloSign.open({
			skipDomainVerification: false,
			url: 'https://app.hellosign.com/editor/embeddedSign?signature_id=0ed6c036e853cdd42245677148db30f8&token=8417f24c8018171a01fe195f395dbbac',
			allowCancel: true,
			uxVersion: 2,
			debug: true,
			messageListener: (eventData) => {
				console.log('HSEvent:', eventData);
				if (eventData.event === HelloSign.EVENT_SIGNED) {
					// Go to a signature confirmation page
					console.log('Document is signed successfully');
				}
			}
		});
	}
}
