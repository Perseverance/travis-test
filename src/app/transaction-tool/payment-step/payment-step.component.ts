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

	private addressSubscription: Subscription;
	public deedId: SmartContractAddress;

	constructor(private authService: AuthenticationService,
		private smartContractService: SmartContractConnectionService,
		private deedsService: DeedsService,
		private route: ActivatedRoute,
		private notificationsService: NotificationsService,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);

		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.isAnonymous) {
					return;
				}
				this.userIsBuyer = (userInfo.user.role === UserRoleEnum.Buyer);
				this.hasUserDataLoaded = true;
			}
		});
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
			self.escrowAddress = await self.smartContractService.getEscrowAddress(deedId);
			self.invitationDataLoaded = true;
		});

	}

	ngOnDestroy() {
		this.addressSubscription.unsubscribe();
	}

	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async sendPayment() {
		this.notificationsService.pushInfo({
			title: 'Sending payment transaction. Please wait. A normal blockchain transaction can go up to few minutes, so be patient.',
			message: '',
			time: (new Date().getTime()),
			timeout: 180000
		});
		await this.smartContractService.sendPayment(this.deedId);
		this.notificationsService.pushSuccess({
			title: 'Success',
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

}
