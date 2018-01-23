import { EthereumAddress, SmartContractAddress } from './smart-contract-connection.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Web3Service } from '../web3-connection/web3-connection.service';
import { BaseContract } from '../web3-connection/BaseContract';

export enum Status {
	rejectedDeal = -2,
	canceledDeal = -1,
	reserve = 0,
	partiesInvited = 1,
	partiesAccepted = 2,
	reservedOnBlockchain = 3,
	purchaseAgreement = 4,
	purchaseAgreementBlockchain = 5,
	titleReport = 6,
	titleReportBlockchain = 7,
	Disclosures = 8,
	DisclosuresBlockchain = 9,
	settlementStatement = 10,
	payment = 11,
	affidavit = 12,
	affidavitBlockchain = 13,
	closingDocuments = 14,
	transferred = 15
}

export enum SMART_CONTRACT_DOCUMENT_TYPES {
	PURCHASE_AGREEMENT = 1,
	TITLE_REPORT = 2,
	SELLER_DISCLOSURES = 3,
	PAYMENT = 4,
	AFFIDAVIT = 5,
	OWNERSHIP_TRANSFER = 6
}

export enum SMART_CONTRACT_STATUSES {
	STATUS_SUCCESS = 1,
	STATUS_FAIL = 2,
}

export type EthereumAddress = string;
export type SmartContractAddress = string;

@Injectable()
export class SmartContractConnectionService {

	private jsonFile: object;

	private baseDeedContract: any;
	private contractAbi: any;

	constructor(private web3Service: Web3Service) {
		this.contractAbi = BaseContract.abi;
	}

	public saveCredentials(_jsonFile: object) {
		this.jsonFile = _jsonFile;
	}

	private get credentialsSet(): boolean {
		return (this.jsonFile !== undefined);
	}

	public async recordPurchaseAgreement(walletPassword: string, deedAddress: string, doc: string): Promise<any> {
		return this.recordDocument(walletPassword, deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.PURCHASE_AGREEMENT, 'PURCHASE_AGREEMENT', doc);
	}

	public async recordTitleReport(walletPassword: string, deedAddress: string, doc: string): Promise<any> {
		return this.recordDocument(walletPassword, deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.TITLE_REPORT, 'TITLE_REPORT', doc);
	}

	public async recordSellerDisclosures(walletPassword: string, deedAddress: string, doc: string): Promise<any> {
		return this.recordDocument(walletPassword, deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.SELLER_DISCLOSURES, 'SELLER_DISCLOSURES', doc);
	}

	public async recordAffidavit(walletPassword: string, deedAddress: string, doc: string): Promise<any> {
		return this.recordDocument(walletPassword, deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.AFFIDAVIT, 'AFFIDAVIT', doc);
	}

	public async recordOwnershipTransfer(walletPassword: string, deedAddress: string, doc: string): Promise<any> {
		return this.recordDocument(walletPassword, deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.OWNERSHIP_TRANSFER, 'TITLE_HASH', doc);
	}

	private convertWalletToKeys(walletPassword: string) {
		if (!this.credentialsSet) {
			throw new Error('No credentials');
		}
		try {
			return this.web3Service.convertWalletToKeys(this.jsonFile, walletPassword);
		} catch (e) {
			throw new Error('Could not decrypt your wallet. Possibly wrong password');
		}
	}

	private async recordDocument(
		walletPassword: string,
		deedAddress: string,
		docType: SMART_CONTRACT_DOCUMENT_TYPES,
		docKey: string,
		doc: string) {
		if (!this.credentialsSet) {
			throw new Error('No credentials');
		}
		const keys = this.convertWalletToKeys(walletPassword);

		const callOptions = {
			from: keys.address,
		};

		this.baseDeedContract = new this.web3Service.web3.eth.Contract(
			this.contractAbi,
			deedAddress,
		);

		const deedActionMethod = this.baseDeedContract.methods.action(
			docType,
			[this.web3Service.web3.utils.asciiToHex(docKey)],
			[this.web3Service.web3.utils.sha3(doc)],
			SMART_CONTRACT_STATUSES.STATUS_SUCCESS);
		const estimatedGas = await deedActionMethod.estimateGas();
		const doubleGas = 200000;

		const funcData = deedActionMethod.encodeABI(callOptions);
		const signedData = await this.web3Service.signTransaction(
			this.baseDeedContract._address,
			keys.address,
			keys.privateKey,
			doubleGas,
			funcData,
		);

		const result = await this.web3Service.web3.eth.sendSignedTransaction(signedData);
		return result;
	}

}
