import { Web3Service } from './../web3/web3.service';
import { EthereumAddress, SmartContractAddress } from './smart-contract-connection.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { TestContract } from '../web3/contracts';

export enum Status {
	reserve = 0,
	partiesInvited = 1,
	partiesAccepted = 2,
	purchaseAgreement = 3,
	titleReport = 4,
	sellerDisclosures = 5,
	settlementStatement = 6,
	affidavit = 7,
	closingDocuments = 8,
	payment = 9,
	receivedPayment = 10,
	titleDeed = 11,
	completed = 12
}

export type EthereumAddress = string;
export type SmartContractAddress = string;

@Injectable()
export class SmartContractConnectionService {

	private publicKey: string;
	private privateKey: string;

	private testContract: any;

	constructor(private web3Service: Web3Service) {
		const contractAbi = TestContract.abi;
		this.testContract = new web3Service.web3.eth.Contract(
			contractAbi,
			environment.contractAddress,
		);
	}

	public saveCredentials(_publicKey: string, _privateKey: string) {
		this.publicKey = _publicKey;
		this.privateKey = _privateKey;
	}

	private get credentialsSet(): boolean {
		return (this.publicKey !== undefined && this.privateKey !== undefined);
	}

	public async testSignTransaction(): Promise<any> {
		if (!this.credentialsSet) {
			throw new Error('No credentials');
		}
		const callOptions = {
			from: this.publicKey,
		};
		const setIntMethod = this.testContract.methods.setInt(1, 2);
		const estimatedGas = await setIntMethod.estimateGas();
		const doubleGas = estimatedGas * 2;

		const funcData = setIntMethod.encodeABI(callOptions);
		const signedData = await this.web3Service.signTransaction(
			this.testContract._address,
			this.publicKey,
			this.privateKey,
			doubleGas,
			funcData,
		);

		const result = await this.web3Service.web3.eth.sendSignedTransaction(signedData);
		return result;
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

	public async hasBuyerSignedPurchaseAgreement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async hasSellerSignedPurchaseAgreement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async hasBuyerBrokerSignedPurchaseAgreement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async hasSellerBrokerSignedPurchaseAgreement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async signPurchaseAgreement(deedContractAddress: SmartContractAddress,
		purchaseAgreementSignatureRequestId: string): Promise<boolean> {
		return true;
	}

	public async hasBuyerSignedTitleReport(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async hasSellerSignedTitleReport(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async isTitleReportUploaded(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async isSettlementStatementUploaded(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markSettlementStatementUploaded(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async getTitleReportSignatureRequestId(deedContractAddress: SmartContractAddress): Promise<string> {
		return '';
	}

	public async signSettlementStatement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async hasBuyerSignedSettlementStatement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return false;
	}

	public async hasSellerSignedSettlementStatement(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async isSellerDisclosuresUploaded(deedContractAddress: SmartContractAddress): Promise<boolean> {
		return true;
	}

	public async markSellerDisclosuresUploaded(sellerDisclosuresSignatureRequestId: string): Promise<boolean> {
		return true;
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
