import { Injectable } from '@angular/core';
import Web3 from 'web3';
import Accounts from 'web3-eth-accounts';
import { default as EthereumTx } from 'ethereumjs-tx';
import { default as Wallet } from 'ethereumjs-wallet';
import { environment } from '../../environments/environment';
import { Buffer } from 'buffer';

@Injectable()
export class Web3Service {

	public web3: Web3;
	public accounts: Accounts;

	constructor() {
		this.web3 = new Web3(new Web3.providers.HttpProvider(environment.infuraLink));
		this.accounts = new Accounts(environment.infuraLink);
	}

	public async signTransaction(
		toAddress,
		fromAddress,
		fromPrivateKey,
		gasLimit,
		funcData,
		value = 0) {
		const privateKeyBuff = new Buffer(fromPrivateKey, 'hex');

		const nonceNumber = await this.web3.eth.getTransactionCount(fromAddress);
		const gasPrice = await this.web3.eth.getGasPrice();
		const rawTx = {
			'nonce': nonceNumber,
			'gasPrice': this.web3.utils.toHex(gasPrice),
			'gasLimit': gasLimit,
			'from': fromAddress,
			'to': toAddress,
			'value': this.web3.utils.toHex(value),
			'data': funcData,
		};

		// TODO validate
		this.isTxDataValid(rawTx);

		const tx = new EthereumTx(rawTx);
		tx.sign(privateKeyBuff);
		const serializedTx = tx.serialize();

		return '0x' + serializedTx.toString('hex');
	}

	private validateEtherAddress(address) {
		if (address.substring(0, 2) !== '0x') {
			return false;
		} else if (!/^(0x)?[0-9a-f]{40}$/i.test(address)) {
			return false;
		} else if (/^(0x)?[0-9a-f]{40}$/.test(address) || /^(0x)?[0-9A-F]{40}$/.test(address)) {
			return true;
		}
		return true;
	}

	private validateHexString(str) {
		if (str === '') {
			return true;
		}
		const strLoc = (str.substring(0, 2) === '0x') ? str.substring(2).toUpperCase() : str.toUpperCase();
		const re = /^[0-9A-F]+$/g;
		return re.test(strLoc);
	}


	private isTxDataValid(txData) {
		if (txData.to !== '0xCONTRACT' && !this.validateEtherAddress(txData.to)) {
			throw new Error('Invalid Address');
		}
		if (parseFloat(txData.gasLimit) <= 0) {
			throw new Error('Invalid gas Limit');
		}
		if (!this.validateHexString(txData.data)) {
			throw new Error('Invalid data');
		}
	}

	public toBytes32(i) {
		const stringed = '0000000000000000000000000000000000000000000000000000000000000000' + i.toString(16);
		return '0x' + stringed.substring(stringed.length - 64, stringed.length);
	}


	public async createAccount(_password: string) {
		const account = await this.accounts.create();
		const privateKey = new Buffer(account.privateKey.slice(2), 'hex');
		const wallet = await Wallet.fromPrivateKey(privateKey);

		const result = {
			address: wallet.getAddressString(),
			fileName: wallet.getV3Filename(),
			jsonFile: wallet.toV3(_password)
		};
		return result;
	}

	public convertWalletToKeys(jsonFile: object, walletPassword: string) {
		const wallet = Wallet.fromV3(jsonFile, walletPassword);

		const address = wallet.getAddressString();
		let privateKey = wallet.getPrivateKeyString();

		if (privateKey.startsWith('0x')) {
			privateKey = privateKey.substring(2);
		}

		return {
			address,
			privateKey
		};
	}



}
