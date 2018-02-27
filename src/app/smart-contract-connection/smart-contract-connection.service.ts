import { EthereumAddress, SmartContractAddress } from './smart-contract-connection.service';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Web3Service } from '../web3-connection/web3-connection.service';
import { BaseContract } from '../web3-connection/BaseContract';
import { TransactionReceipt, PromiEvent } from 'web3/types';

// ToDo: Affidavit step hide, next steps are decremented with 1

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
	// affidavit = 12,
	// affidavitBlockchain = 13,
	closingDocuments = 12,
	transferred = 13
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

	public recordPurchaseAgreement(walletPassword: string, deedAddress: string, doc: string) {
		return this.recordDocument(walletPassword, deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.PURCHASE_AGREEMENT, 'PURCHASE_AGREEMENT', doc);
	}

	public recordTitleReport(walletPassword: string, deedAddress: string, doc: string) {
		return this.recordDocument(walletPassword, deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.TITLE_REPORT, 'TITLE_REPORT', doc);
	}

	public recordSellerDisclosures(walletPassword: string, deedAddress: string, doc: string) {
		return this.recordDocument(walletPassword, deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.SELLER_DISCLOSURES, 'SELLER_DISCLOSURES', doc);
	}

	public recordAffidavit(walletPassword: string, deedAddress: string, doc: string) {
		return this.recordDocument(walletPassword, deedAddress, SMART_CONTRACT_DOCUMENT_TYPES.AFFIDAVIT, 'AFFIDAVIT', doc);
	}

	public recordOwnershipTransfer(walletPassword: string, deedAddress: string, doc: string) {
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

	private async recordDocument(walletPassword: string,
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

		const self = this;

		return new Promise(function (resolve, reject) {
			self.web3Service.web3.eth.sendSignedTransaction(signedData)
				.once('transactionHash', function (transactionHash) {
					resolve({ transactionHash });
				});
		});


	}

}
