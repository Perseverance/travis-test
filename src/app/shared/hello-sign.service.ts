import {Injectable} from '@angular/core';
import {environment} from '../../environments/environment';

declare const HelloSign;

@Injectable()
export class HelloSignService {

	constructor() {
	}

	public async signDocument(signUrl: string): Promise<boolean> {
		return await (new Promise<boolean>((resolve, reject) => {
			HelloSign.init(environment.helloSign.clientId);
			HelloSign.open({
				skipDomainVerification: true, // ToDo: change to false on production
				url: signUrl,
				allowCancel: true,
				uxVersion: 2,
				debug: true,
				messageListener: (eventData) => {
					if (eventData.event === HelloSign.EVENT_SIGNED) {
						resolve(true);
					}
				}
			});
		}));
	}
}
