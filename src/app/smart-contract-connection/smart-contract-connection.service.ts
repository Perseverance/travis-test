import {EthereumAddress, SmartContractAddress} from './smart-contract-connection.service';
import {Injectable} from '@angular/core';

export enum Status {
	reserve,
	sellerInvited,
	agentInvited,
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
	deedContractAddress: SmartContractAddress;
	status: Status;
	createdAt: number;
	lastUpdatedAt: number;
	propertyAddress: string;
	priceInWei: string;
}

export type EthereumAddress = string;
export type SmartContractAddress = string;

@Injectable()
export class SmartContractConnectionService {

	constructor() {
	}

	private fakeDeedStatus = Status.closingDocuments;

	private fakeDeedAddress = '0x406e4e45985acf237c05c8f0d80dd2b11e4042db';
	private fakePropertyAddress = 'Kmetska Sgrada, Gabrovo, Gabrovo, Bulgaria';

	private fakeCreatedAt = this.nowMinusDays(5);
	private fakelastUpdatedAt = this.nowMinusDays(1);
	private fakePriceInWei = '234774029745332110000';

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
				lastUpdatedAt: this.fakelastUpdatedAt,
				priceInWei: this.fakePriceInWei
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

	public async getEscrowDeeds(): Promise<Deed[]> {
		return this.getDeeds();
	}

	public async getDeedDetails(deedContractAddress: SmartContractAddress): Promise<Deed> {
		return {
			deedContractAddress: this.fakeDeedAddress,
			status: this.fakeDeedStatus,
			propertyAddress: this.fakePropertyAddress,
			createdAt: this.fakeCreatedAt,
			lastUpdatedAt: this.fakelastUpdatedAt,
			priceInWei: this.fakePriceInWei
		};
	}

	public async createDeed(propertyLocationAddress: string,
							sellerAddress: EthereumAddress,
							brokerAddress: EthereumAddress,
							escrowAddress: EthereumAddress,
							priceInETH: number): Promise<SmartContractAddress> {
		return this.fakeDeedAddress;
	}

	public async markSellerInvitationSent(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markSellerAcceptedInvitation(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markSellerRejectedInvitation(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async isSellerInvited(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markEscrowInvitationSent(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markEscrowAcceptedInvitation(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markEscrowRejectedInvitation(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async isEscrowInvited(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async getBuyerAddress(deedContractAddress: SmartContractAddress): Promise<EthereumAddress> {
		return '0xCf2C2352A96dDf5d1978324346c46B58d867066c';
	}

	public async getBrokerAddress(deedContractAddress: SmartContractAddress): Promise<EthereumAddress> {
		return '0xf720b4568A72DDAa1c1FcA43cB5d5dfa46edfdf3';
	}

	public async getSellerAddress(deedContractAddress: SmartContractAddress): Promise<EthereumAddress> {
		return '0x252490Bbcf48C58c90F5489A2A5bA0B4cDC21947';
	}

	public async getEscrowAddress(deedContractAddress: SmartContractAddress): Promise<EthereumAddress> {
		return '0x9BaA0E7c890E356c050326EC8EFf627d9fa59625';
	}

	public async markPurchaseAgreementUploaded(purchaseAgreementSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async isPurchaseAgreementUploaded(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async getPurchaseAgreementSignatureRequestId(deedContractAddress: SmartContractAddress): Promise<string> {
		return '84561d5d6231ef613004e42fba2cf582f6a724ab';
		// return 'hardcoded_request_id';
	}

	public async hasBuyerSignedPurchaseAgreement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async hasSellerSignedPurchaseAgreement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async hasBrokerSignedPurchaseAgreement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async signPurchaseAgreement(deedContractAddress: SmartContractAddress,
									   purchaseAgreementSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async isSettlementStatementUploaded(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markSettlementStatementUploaded(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async getSettlementStatementSignatureRequestId(deedContractAddress: SmartContractAddress): Promise<string> {
		return 'c99ef5deb31113223dea76972a9e7f2a5e17002d';
	}

	public async signSettlementStatement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async hasBuyerSignedSettlementStatement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async hasSellerSignedSettlementStatement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async hasBrokerSignedSettlementStatement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async isSellerDisclosuresUploaded(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markSellerDisclosuresUploaded(sellerDisclosuresSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async getSellerDisclosuresSignatureRequestId(deedContractAddress: SmartContractAddress): Promise<string> {
		return '3002444ad02dbfa4df95a32bc009c5a809d44f09';
	}

	public async signSellerDisclosures(deedContractAddress: SmartContractAddress,
									   sellerDisclosuresSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async hasBuyerSignedSellerDisclosures(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async hasSellerSignedSellerDisclosures(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async hasBrokerSignedSellerDisclosures(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async isClosingDocumentsUploaded(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async markClosingDocumentsUploaded(closingDocumentsSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async getClosingDocumentsSignatureRequestId(deedContractAddress: SmartContractAddress): Promise<string> {
		return 'hardcoded_request_id';
	}

	public async signClosingDocuments(deedContractAddress: SmartContractAddress,
									  closingDocumentsSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async hasBuyerSignedClosingDocuments(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async hasSellerSignedClosingDocuments(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async hasBrokerSignedClosingDocuments(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async hasEscrowSignedClosingDocuments(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async getDeedPrice(deedContractAddress: SmartContractAddress): Promise<number> {
		return 200000;
	}

	public async sendPayment(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markPaymentReceived(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markTitleDeedReceived(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markDeedAsClosed(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

}
