import { environment } from './../../../environments/environment';
import { DeedsService } from './../../shared/deeds.service';
import { NotificationsService } from './../../shared/notifications/notifications.service';
import { ActivatedRoute } from '@angular/router';
import {
	SmartContractAddress,
	SmartContractConnectionService, EthereumAddress
} from './../../smart-contract-connection/smart-contract-connection.service';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { UserRoleEnum } from './../enums/user-role.enum';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { Component, OnInit } from '@angular/core';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-payment-step',
	templateUrl: './payment-step.component.html',
	styleUrls: ['./payment-step.component.scss']
})
export class PaymentStepComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	public userIsBuyer: boolean;
	public hasUserDataLoaded = false;
	public invitationDataLoaded = false;
	public deedDetails: any;
	public escrowAddress: EthereumAddress;
	public contactAgentForm: FormGroup;


	private addressSubscription: Subscription;
	public deedId: SmartContractAddress;
	payments: any[];
	constructor(private authService: AuthenticationService,
		private smartContractService: SmartContractConnectionService,
		private deedsService: DeedsService,
		private route: ActivatedRoute,
		private notificationsService: NotificationsService,
		private formBuilder: FormBuilder,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);

		this.contactAgentForm = this.formBuilder.group({
			paymentId: [undefined, [Validators.required]]
		});

		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.isAnonymous) {
					return;
				}
				this.hasUserDataLoaded = true;
			}
		});

		this.payments = [];
		this.payments.push({ id: 0, name: 'ETH' });
		this.payments.push({ id: 1, name: 'BTC' });
		this.payments.push({ id: 2, name: 'USD' });
	}

	async ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedId) {
			if (!deedId) {
				throw new Error('No deed address supplied');
			}
			self.deedId = deedId;
			self.deedDetails = await self.deedsService.getDeedDetails(deedId);
			self.escrowAddress = self.deedDetails.paymentAddress;
			self.invitationDataLoaded = true;
			await self.mapCurrentUserToRole(deedId);
		});
		this.paymentId.setValue(this.payments[0].id);
	}

	public get paymentId() {
		return this.contactAgentForm.get('paymentId');
	}
	ngOnDestroy() {
		this.addressSubscription.unsubscribe();
	}

	private async mapCurrentUserToRole(deedId) {
		const deed = await this.deedsService.getDeedDetails(deedId);
		this.userIsBuyer = (deed.currentUserRole === UserRoleEnum.Buyer);
	}

	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async sendPayment() {
		this.notificationsService.pushInfo({
			title: 'Sending payment transaction. Please wait. A normal blockchain transaction can go up to few minutes, so be patient.',
			message: '',
			time: (new Date().getTime()),
			timeout: 180000
		});
		this.notificationsService.pushSuccess({
			title: 'Success',
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

}
