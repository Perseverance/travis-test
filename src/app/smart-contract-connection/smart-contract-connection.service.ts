import { EthereumAddress, SmartContractAddress } from './smart-contract-connection.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Web3Service } from '../web3-connection/web3-connection.service';
import { BaseContract } from '../web3-connection/BaseContract';

export enum Status {
	reserve = 0,
	partiesInvited = 1,
	partiesAccepted = 2,
	reservedOnBlockchain = 3,
	purchaseAgreement = 4,
	purchaseAgreementBlockchain = 5,
	titleReport = 6,
	titleReportBlockchain = 7,
	sellerDisclosures = 8,
	sellerDisclosuresBlockchain = 9,
	settlementStatement = 10,
	payment = 11,
	receivedPayment = 12,
	affidavit = 13,
	affidavitBlockchain = 14,
	closingDocuments = 15,
	completed = 16
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

	private publicKey: string;
	private privateKey: string;

	private baseDeedContract: any;
	private contractAbi: any;

	constructor(private web3Service: Web3Service) {
		this.contractAbi = BaseContract.abi;
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
		const setIntMethod = this.baseDeedContract.methods.approve();
		const estimatedGas = await setIntMethod.estimateGas();
		const doubleGas = estimatedGas * 2;

		const funcData = setIntMethod.encodeABI(callOptions);
		const signedData = await this.web3Service.signTransaction(
			this.baseDeedContract._address,
			this.publicKey,
			this.privateKey,
			doubleGas,
			funcData,
		);



		return signedData;

		// const result = await this.web3Service.web3.eth.sendSignedTransaction(signedData);
		// return result;
	}

	public async recordPurchaseAgreement(deedAddress: string, doc: string): Promise<any> {
		return this.recordDocument(deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.PURCHASE_AGREEMENT, 'PURCHASE_AGREEMENT', doc);
	}

	public async recordTitleReport(deedAddress: string, doc: string): Promise<any> {
		return this.recordDocument(deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.TITLE_REPORT, 'TITLE_REPORT', doc);
	}

	public async recordSellerDisclosures(deedAddress: string, doc: string): Promise<any> {
		return this.recordDocument(deedAddress, MART_CONTRACT_DOCUMENT_TYPES.SELLER_DISCLOSURES, 'SELLER_DISCLOSURES', doc);
	}

	public async recordAffidavit(deedAddress: string, doc: string): Promise<any> {
		return this.recordDocument(deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.AFFIDAVIT, 'AFFIDAVIT', doc);
	}

	public async recordOwnershipTransfer(deedAddress: string, doc: string): Promise<any> {
		return this.recordDocument(deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.OWNERSHIP_TRANSFER, 'OWNERSHIP_TRANSFER', doc);
	}

	private async recordDocument(deedAddress: string, docType: SMART_CONTRACT_DOCUMENT_TYPES, docKey: string, doc: string) {
		if (!this.credentialsSet) {
			throw new Error('No credentials');
		}
		const callOptions = {
			from: this.publicKey,
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
		const doubleGas = estimatedGas * 4;

		const funcData = deedActionMethod.encodeABI(callOptions);
		const signedData = await this.web3Service.signTransaction(
			this.baseDeedContract._address,
			this.publicKey,
			this.privateKey,
			doubleGas,
			funcData,
		);

		const result = await this.web3Service.web3.eth.sendSignedTransaction(signedData);
		return result;
	}

}
