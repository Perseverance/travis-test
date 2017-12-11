import { UserRoleEnum } from './../enums/user-role.enum';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { NotificationsService } from './../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SmartContractConnectionService, SmartContractAddress, Status } from './../../smart-contract-connection/smart-contract-connection.service';
import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { DeedsService } from '../../shared/deeds.service';

@Component({
	selector: 'app-invite-seller',
	templateUrl: './invite-seller.component.html',
	styleUrls: ['./invite-seller.component.scss']
})
export class InviteSellerComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	public isSellerInvited: boolean;
	public invitationDataLoaded = false;
	public successMessage = 'Success!';

	private addressSubscription: Subscription;
	public deedAddress: SmartContractAddress;

	public inviteSellerTitle = 'Invite seller to this deed';
	public waitingForBrokerTitle = 'Waiting for broker to invite seller';
	public waitingForSellerTitle = 'Waiting for seller to respond to invitation';
	public respondToInvitationTitle = 'Respond to this invitation';

	private userInfo: any;
	public userIsAgent: boolean;
	public userIsSeller: boolean;
	public hasDataLoaded = false;

	constructor(private authService: AuthenticationService,
		private route: ActivatedRoute,
		private smartContractConnectionService: SmartContractConnectionService,
		private deedsService: DeedsService,
		private notificationService: NotificationsService,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);

		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.isAnonymous) {
					return;
				}
				this.userIsAgent = (userInfo.user.role === UserRoleEnum.Agent);
				this.userIsSeller = (userInfo.user.role === UserRoleEnum.Seller);
				this.hasDataLoaded = true;
			}
		});
	}

	async ngOnInit() {
		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedAddress) {
			if (!deedAddress) {
				throw new Error('No deed address supplied');
			}
			self.deedAddress = deedAddress;
			const deed = await self.smartContractConnectionService.getDeedDetails(deedAddress);
			self.isSellerInvited = (deed.status >= Status.sellerInvited);
			self.invitationDataLoaded = true;
		});

	}

	ngOnDestroy() {
		this.addressSubscription.unsubscribe();
	}

	// TODO change message
	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async onInvite(email) {
		this.notificationService.pushInfo({
			title: `Inviting ${email}. Please wait. A normal blockchain transaction can go up to few minutes, so be patient.`,
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		await this.smartContractConnectionService.markSellerInvitationSent(this.deedAddress);
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});

	}

	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async onAccept() {
		this.notificationService.pushInfo({
			title: 'Recording your response. Please wait. A normal blockchain transaction can go up to few minutes, so be patient.',
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		await this.smartContractConnectionService.markSellerAcceptedInvitation(this.deedAddress);
		await this.deedsService.sendSellerAccept(this.deedAddress);
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async onReject() {
		this.notificationService.pushInfo({
			title: 'Recording your response. Please wait. A normal blockchain transaction can go up to few minutes, so be patient.',
			message: '',
			time: (new Date().getTime()),
			timeout: 60000
		});
		await this.smartContractConnectionService.markSellerRejectedInvitation(this.deedAddress);
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

}
