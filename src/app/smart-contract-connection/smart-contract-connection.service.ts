import { Injectable } from '@angular/core';

export enum Status {
	reserve,
	sellerInvited,
	agentInvited,
	verified,
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

	constructor() {
	}

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

	public async getDeedDetails(deedContractAddress: EthereumAddress) {
		return {
			deedContractAddress: this.fakeDeedAddress,
			status: this.fakeDeedStatus,
			propertyAddress: this.fakePropertyAddress,
			createdAt: this.fakeCreatedAt,
			lastUpdatedAt: this.fakelastUpdatedAt
		};
	}

	public async createDeed(propertyLocationAddress: string,
		sellerAddress: EthereumAddress,
		brokerAddress: EthereumAddress,
		escrowAddress: EthereumAddress,
		priceInETH: number): Promise<SmartContractAddress> {
		return this.fakeDeedAddress;
	}

	public async markSellerInvitationSent(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async markSellerAcceptedInvitation(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async isSellerInvited(deedContractAddress: EthereumAddress): Promise<boolean> {
		return false;
	}

	public async markEscrowInvitationSent(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async markEscrowAcceptedInvitation(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async isEscrowInvited(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async markPurchaseAgreementUploaded(purchaseAgreementSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async getPurchaseAgreementSignatureRequestId(deedContractAddress: EthereumAddress): Promise<string> {
		return 'hardcoded_request_id';
	}

	public async hasBuyerSignedPurchaseAgreement(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async hasSellerSignedPurchaseAgreement(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async hasBrokerSignedPurchaseAgreement(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async signPurchaseAgreement(deedContractAddress: EthereumAddress, purchaseAgreementSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async markSettlementStatementUploaded(): Promise<boolean> {
		return true;
	}

	public async markSellerDisclosuresUploaded(sellerDisclosuresSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async getSellerDisclosuresSignatureRequestId(deedContractAddress: EthereumAddress): Promise<string> {
		return 'hardcoded_request_id';
	}

	public async signSellerDisclosures(deedContractAddress: EthereumAddress, sellerDisclosuresSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async markClosingDocumentsUploaded(closingDocumentsSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async getClosingDocumentsSignatureRequestId(deedContractAddress: EthereumAddress): Promise<string> {
		return 'hardcoded_request_id';
	}

	public async signClosingDocuments(deedContractAddress: EthereumAddress, closingDocumentsSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async getDeedPrice(deedContractAddress: EthereumAddress): Promise<number> {
		return 200000;
	}

	public async sendPayment(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async markPaymentReceived(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async markTitleDeedReceived(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

	public async markDeedAsClosed(deedContractAddress: EthereumAddress): Promise<boolean> {
		return true;
	}

}
