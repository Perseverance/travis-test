import { EthereumAddress, SmartContractAddress } from './smart-contract-connection.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Web3Service } from '../web3-connection/web3-connection.service';
import { BaseContract } from '../web3-connection/BaseContract';

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

	constructor(private web3Service: Web3Service) {
		const contractAbi = BaseContract.abi;
		this.baseDeedContract = new web3Service.web3.eth.Contract(
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

	public async recordPurchaseAgreement(document: string): Promise<any> {
		return this.recordDocument(SMART_CONTRACT_DOCUMENT_TYPES.PURCHASE_AGREEMENT, 'PURCHASE_AGREEMENT', document);
	}

	public async recordTitleReport(document: string): Promise<any> {
		return this.recordDocument(SMART_CONTRACT_DOCUMENT_TYPES.TITLE_REPORT, 'TITLE_REPORT', document);
	}

	public async recordSellerDisclosures(document: string): Promise<any> {
		return this.recordDocument(SMART_CONTRACT_DOCUMENT_TYPES.SELLER_DISCLOSURES, 'SELLER_DISCLOSURES', document);
	}

	public async recordAffidavit(document: string): Promise<any> {
		return this.recordDocument(SMART_CONTRACT_DOCUMENT_TYPES.AFFIDAVIT, 'AFFIDAVIT', document);
	}

	public async recordOwnershipTransfer(document: string): Promise<any> {
		return this.recordDocument(SMART_CONTRACT_DOCUMENT_TYPES.OWNERSHIP_TRANSFER, 'OWNERSHIP_TRANSFER', document);
	}

	private async recordDocument(docType: SMART_CONTRACT_DOCUMENT_TYPES, docKey: string, document: string) {
		if (!this.credentialsSet) {
			throw new Error('No credentials');
		}
		const callOptions = {
			from: this.publicKey,
		};
		const deedActionMethod = this.baseDeedContract.methods.action(
			docType,
			docKey,
			[document],
			SMART_CONTRACT_STATUSES.STATUS_SUCCESS);
		const estimatedGas = await deedActionMethod.estimateGas();
		const doubleGas = estimatedGas * 2;

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
