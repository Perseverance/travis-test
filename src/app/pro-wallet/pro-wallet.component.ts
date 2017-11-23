import {Subscription} from 'rxjs/Subscription';
import {TranslateService} from '@ngx-translate/core';
import {ErrorsService} from './../shared/errors/errors.service';
import {ErrorsDecoratableComponent} from './../shared/errors/errors.decoratable.component';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserData} from './../authentication/authentication.service';
import {Component, OnInit, OnDestroy} from '@angular/core';
import {ProWalletService} from './pro-wallet.service';
import {UserTransactionsHistoryResponse} from './pro-wallet-responses';
import {AuthenticationService} from '../authentication/authentication.service';
import {NotificationsService} from '../shared/notifications/notifications.service';
import {DefaultAsyncAPIErrorHandling} from '../shared/errors/errors.decorators';
import {ConfirmationService} from 'primeng/primeng';

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

	constructor(private proWalletService: ProWalletService,
				private formBuilder: FormBuilder,
				private authService: AuthenticationService,
				private notificationsService: NotificationsService,
				errorsService: ErrorsService,
				translateService: TranslateService,
				private confirmationService: ConfirmationService) {
		super(errorsService, translateService);

		this.proWalletAddressForm = this.formBuilder.group({
			proWalletAddress: [null, [Validators.required]],
		});

		this.userDataSubscription = this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (!userInfo.user.walletId) {
					return;
				}
				this.proWalletAddress.setValue(userInfo.user.walletId);
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

	ngOnDestroy(): void {
		this.userDataSubscription.unsubscribe();
	}

	private async getTransactionHistory() {
		this.userTransactionsHistory = await this.proWalletService.userTransactionsHistory();
		this.shouldShowRedeemSection = this.userTransactionsHistory.isCanRedeemStashedTokens;
		this.stashedTokensBalance = this.userTransactionsHistory.stashedTokensBalance;
	}

	public get proWalletAddress() {
		return this.proWalletAddressForm.get('proWalletAddress');
	}

	@DefaultAsyncAPIErrorHandling('settings.set-pro-address.could-not-set-address')
	public async onSubmit() {
		await this.proWalletService.updateAddress(this.proWalletAddress.value);
		await this.getTransactionHistory();
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
