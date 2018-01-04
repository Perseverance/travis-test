import { Web3Service } from './../web3-connection/web3-connection.service';
import { Subscription } from 'rxjs/Subscription';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../shared/errors/errors.decoratable.component';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserData } from './../authentication/authentication.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { ProWalletService } from './pro-wallet.service';
import { UserTransactionsHistoryResponse } from './pro-wallet-responses';
import { AuthenticationService } from '../authentication/authentication.service';
import { NotificationsService } from '../shared/notifications/notifications.service';
import { DefaultAsyncAPIErrorHandling } from '../shared/errors/errors.decorators';
import { ConfirmationService } from 'primeng/primeng';
import { WalletAddressValidator } from './pro-wallet-address-validator';

@Component({
	selector: 'app-pro-wallet',
	templateUrl: './pro-wallet.component.html',
	styleUrls: ['./pro-wallet.component.scss']
})
export class ProWalletComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	public userTransactionsHistory: UserTransactionsHistoryResponse;

	public proWalletAddressForm: FormGroup;
	private successMessage: string;
	public shouldShowRedeemSection = false;
	public refreshTransactionHistoryProcessing = false;
	public confirmationLabels: object;
	public stashedTokensBalance: number;
	private userDataSubscription: Subscription;
	public showBackupWalletButton = false;
	public jsonWallet: string;

	constructor(private proWalletService: ProWalletService,
		private formBuilder: FormBuilder,
		private authService: AuthenticationService,
		private notificationsService: NotificationsService,
		errorsService: ErrorsService,
		translateService: TranslateService,
		private confirmationService: ConfirmationService,
		private web3Service: Web3Service) {
		super(errorsService, translateService);

		this.proWalletAddressForm = this.formBuilder.group({
			proWalletPassword: [null, [Validators.required]],
		});
		const self = this;
		this.userDataSubscription = this.authService.subscribeToUserData({
			next: async (userInfo: UserData) => {
				if (!userInfo.user || !userInfo.user.jsonFile) {
					return;
				}
				this.jsonWallet = JSON.parse(userInfo.user.jsonFile);
				this.showBackupWalletButton = true;
			}
		});
	}

	async ngOnInit() {
		await this.getTransactionHistory();

		this.translateService.stream([
			'settings.set-pro-address.succesfully-set-address',
			'settings.my-pro-wallet.confirmation-redeem-heading',
			'settings.my-pro-wallet.confirmation-redeem-message',
			'settings.my-pro-wallet.successfully-redeemed'
		]).subscribe((translations) => {
			this.successMessage = translations['settings.set-pro-address.succesfully-set-address'],
				this.confirmationLabels = {
					heading: translations['settings.my-pro-wallet.confirmation-redeem-heading'],
					message: translations['settings.my-pro-wallet.confirmation-redeem-message'],
					successfullyRedeemed: translations['settings.my-pro-wallet.successfully-redeemed']
				};
		});
	}

	private downloadJSONFile() {
		if (!this.jsonWallet) {
			throw new Error('No wallet to backup');
		}
		const downloader = document.createElement('a');

		const data = JSON.stringify(this.jsonWallet);
		const blob = new Blob([data], { type: 'text/json' });
		const url = window.URL;
		const fileUrl = url.createObjectURL(blob);

		downloader.setAttribute('href', data);
		downloader.setAttribute('download', 'pro-wallet-backup.json');
		downloader.click();

	}

	ngOnDestroy(): void {
		this.userDataSubscription.unsubscribe();
	}

	private async getTransactionHistory() {
		this.userTransactionsHistory = await this.proWalletService.userTransactionsHistory();
		this.shouldShowRedeemSection = this.userTransactionsHistory.isCanRedeemStashedTokens;
		this.stashedTokensBalance = this.userTransactionsHistory.stashedTokensBalance;
		this.authService.getCurrentUser();
	}

	public get proWalletPassword() {
		return this.proWalletAddressForm.get('proWalletPassword');
	}

	@DefaultAsyncAPIErrorHandling('settings.set-pro-address.could-not-set-address')
	public async onSubmit() {
		const result = await this.web3Service.createAccount(this.proWalletPassword.value);
		await this.proWalletService.setWallet(result.publicKey, JSON.stringify(result.jsonFile));
		this.authService.getCurrentUser();
		this.getTransactionHistory();
		this.jsonWallet = result.jsonFile;
		this.showBackupWalletButton = true;
		this.notificationsService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	public redeemProTokens() {
		this.confirmationService.confirm({
			message: this.confirmationLabels['message'],
			header: this.confirmationLabels['heading'],
			key: 'redeemDialog',
			accept: () => this.acceptRedeemingProTokens()
		});
	}

	@DefaultAsyncAPIErrorHandling('settings.my-pro-wallet.redeemed-error-title', 'settings.my-pro-wallet.redeemed-error-message')
	public async acceptRedeemingProTokens() {
		await this.proWalletService.convertStashedTokens();
		this.getTransactionHistory();
		this.notificationsService.pushSuccess({
			title: this.confirmationLabels['successfullyRedeemed'],
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	public async refreshTransactionHistory() {
		this.refreshTransactionHistoryProcessing = true;
		await this.getTransactionHistory();
		this.refreshTransactionHistoryProcessing = false;
	}
}
