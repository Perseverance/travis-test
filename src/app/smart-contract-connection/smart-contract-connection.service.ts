import { Injectable } from '@angular/core';

export enum Status {
	reserve,
	sellerInvited,
	agentInvited,
	verifed,
	purchaseAgreement,
	settlementStatement,
	sellerDisclosures,
	closingDocuments,
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
		escrowAddress: EthereumAddress,
		price: number): Promise<SmartContractAddress> {
		return this.fakeDeedAddress;
	}

	public async markSellerInvitationSent(deedContractAddress: string): Promise<boolean> {
		return true;
	}

	public async markSellerAcceptedInvitation(deedContractAddress: string): Promise<boolean> {
		return true;
	}

	public async markEscrowInvitationSent(deedContractAddress: string): Promise<boolean> {
		return true;
	}

	public async markEscrowAcceptedInvitation(deedContractAddress: string): Promise<boolean> {
		return true;
	}

	public async markDeedVerified(deedContractAddress: string): Promise<boolean> {
		return true;
	}

	public async markPurchaseAgreementUploaded(purchaseAgreementSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async getPurchaseAgreementSignatureRequestId(deedContractAddress: string): Promise<string> {
		return 'hardcoded_request_id';
	}

	public async hasBuyerSignedPurchaseAgreement(deedContractAddress: string): Promise<boolean> {
		return true;
	}

	public async hasSellerSignedPurchaseAgreement(deedContractAddress: string): Promise<boolean> {
		return true;
	}

	public async hasBrokerSignedPurchaseAgreement(deedContractAddress: string): Promise<boolean> {
		return true;
	}

	public async signPurchaseAgreement(deedContractAddress: string, purchaseAgreementSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async markSettlementStatementUploaded(): Promise<boolean> {
		return true;
	}

	public async markSellerDisclosuresUploaded(sellerDisclosuresSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async getSellerDisclosuresSignatureRequestId(deedContractAddress: string): Promise<string> {
		return 'hardcoded_request_id';
	}

	public async signSellerDisclosures(deedContractAddress: string, sellerDisclosuresSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async markClosingDocumentsUploaded(closingDocumentsSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async getClosingDocumentsSignatureRequestId(deedContractAddress: string): Promise<string> {
		return 'hardcoded_request_id';
	}

	public async signClosingDocuments(deedContractAddress: string, closingDocumentsSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async getDeedPrice(deedContractAddress: string): Promise<number> {
		return 200000;
	}

	public async sendPayment(deedContractAddress: string): Promise<boolean> {
		return true;
	}

	public async markPaymentReceived(deedContractAddress: string): Promise<boolean> {
		return true;
	}

}
