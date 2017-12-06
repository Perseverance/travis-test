import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

declare const HelloSign;

@Injectable()
export class HelloSignService {

	constructor() {
	}

	public signDocument(signUrl: string) {
		HelloSign.init(environment.helloSign.clientId);
		HelloSign.open({
			skipDomainVerification: true,
			url: signUrl,
			allowCancel: true,
			uxVersion: 2,
			debug: true,
			messageListener: (eventData) => {
				console.log('HSEvent:', eventData);
				if (eventData.event === HelloSign.EVENT_SIGNED) {
					// Go to a signature confirmation page
					console.log('Document is signed successfully');
					// ToDo: Send to smart contract that sign is successfully and get signed document
				}
			}
		});
	}
}
