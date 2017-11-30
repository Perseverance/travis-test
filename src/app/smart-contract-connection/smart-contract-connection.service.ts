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
	deedContractAddress: EthereumAddress;
	status: Status;
	createdAt: number;
	lastUpdatedAt: number;
	propertyAddress: string;
}

export type EthereumAddress = string;
export type SmartContractAddress = string;

@Injectable()
export class SmartContractConnectionService {

	constructor() { }

	private fakeDeedStatus = Status.reserve;

	private fakeDeedAddress = '0x406e4e45785acf237c05c8f0d80dd2b11e4042db';
	private fakePropertyAddress = 'Kmetska Sgrada, Gabrovo, Gabrovo, Bulgaria';

	private fakeCreatedAt = this.nowMinusDays(5);
	private fakelastUpdatedAt = this.nowMinusDays(1);

	private nowMinusDays(days: number): number {
		const d = new Date();
		d.setDate(d.getDate() - days);
		return d.getTime();
	}

	private async getDeeds(): Promise<Deed[]> {
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

	public async getAgentDeeds(): Promise<Deed[]> {
		return this.getDeeds();
	}

	public async getBuyerDeeds(): Promise<Deed[]> {
		return this.getDeeds();
	}

	public async getSellerDeeds(): Promise<Deed[]> {
		return this.getDeeds();
	}

	public async createDeed(
		propertyLocationAddress: string,
		sellerAddress: EthereumAddress,
		brokerAddress: EthereumAddress,
		escrowAddress: EthereumAddress): Promise<SmartContractAddress> {
		return this.fakeDeedAddress;
	}
}
