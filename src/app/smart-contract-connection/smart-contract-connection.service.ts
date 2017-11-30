import { Injectable } from '@angular/core';

export enum Status {
	reserve,
	sellerInvited,
	agentInvited,
	verifed,
	purchaseAgreement,
	payment,
	receivedPayment,
	titleDeed,
	closed
}

export interface Deed {
	deedContractAddress: string;
	status: Status;
	createdAt: number;
	lastUpdatedAt: number;
	propertyAddress: string;
}

@Injectable()
export class SmartContractConnectionService {

	constructor() { }

	private fakeDeedStatus = Status.reserve;

	private fakeDeedAddress = '0xc213ddab16623d9f005941c4ad717c41d43e58be';
	private fakePropertyAddress = 'Kmetska Sgrada, Gabrovo, Gabrovo, Bulgaria';

	private fakeCreatedAt = this.nowMinusDays(5);
	private fakelastUpdatedAt = this.nowMinusDays(1);

	private nowMinusDays(days: number): number {
		const d = new Date();
		d.setDate(d.getDate() - days);
		return d.getTime();
	}

	private getFakeDeeds(): Deed[] {
		const fakeDeeds = [
			{
				deedContractAddress: this.fakeDeedAddress,
				status: this.fakeDeedStatus,
				propertyAddress: this.fakePropertyAddress,
				createdAt: this.fakeCreatedAt,
				lastUpdatedAt: this.fakelastUpdatedAt
			}
		];

		return fakeDeeds;
	}

	public getAgentDeeds(): Deed[] {
		return this.getFakeDeeds();
	}

	public getBuyerDeeds(): Deed[] {
		return this.getFakeDeeds();
	}

	public getSellerDeeds(): Deed[] {
		return this.getFakeDeeds();
	}
}
