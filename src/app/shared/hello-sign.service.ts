import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

declare const HelloSign;

@Injectable()
export class HelloSignService {

	constructor() {
	}

	public async signDocument(signUrl: string): Promise<any> {
		return (new Promise<boolean>((resolve, reject) => {
			HelloSign.init(environment.helloSign.clientId);
			HelloSign.open({
				skipDomainVerification: environment.helloSign.skipDomainVerification,
				url: signUrl,
				allowCancel: true,
				uxVersion: 2,
				debug: true,
				messageListener: (eventData) => {
					if (!eventData || !eventData.event) {
						reject();
					}
					resolve(eventData.event);
				}
			});
		}));
	}
}
