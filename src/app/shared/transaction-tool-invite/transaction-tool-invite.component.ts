import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { SmartContractConnectionService, SmartContractAddress } from './../../smart-contract-connection/smart-contract-connection.service';
import { ErrorsDecoratableComponent } from './../errors/errors.decoratable.component';
import { UserRoleEnum } from './../../transaction-tool/enums/user-role.enum';
import { TranslateService } from '@ngx-translate/core';
import { ErrorsService } from './../errors/errors.service';
import { NotificationsService } from './../notifications/notifications.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { Component, OnInit } from '@angular/core';
import { DefaultAsyncAPIErrorHandling } from '../errors/errors.decorators';

@Component({
	selector: 'app-transaction-tool-invite',
	templateUrl: './transaction-tool-invite.component.html',
	styleUrls: ['./transaction-tool-invite.component.scss']
})
export class TransactionToolInviteComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	public inviteForm: FormGroup;
	public successMessage: string;

	private userInfo: any;
	public userIsAgent: boolean;
	public hasDataLoaded = false;
	private addressSubscription: Subscription;
	private deedAddress: SmartContractAddress;

	constructor(private authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private notificationService: NotificationsService,
		private smartContractConnectionService: SmartContractConnectionService,
		private route: ActivatedRoute,
		errorsService: ErrorsService,
		translateService: TranslateService) {
		super(errorsService, translateService);
		this.inviteForm = this.formBuilder.group({
			email: ['', [Validators.required]]
		});

		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.isAnonymous) {
					return;
				}
				this.userIsAgent = (userInfo.user.role === UserRoleEnum.Agent);
				this.hasDataLoaded = true;
			}
		});
	}

	public get email() {
		return this.inviteForm.get('email');
	}


	ngOnInit() {

		const self = this;
		const addressObservable: Observable<string> = self.route.parent.params.map(p => p.address);
		this.addressSubscription = addressObservable.subscribe(async function (deedAddress) {
			if (!deedAddress) {
				throw new Error('No deed address supplied');
			}
			self.deedAddress = deedAddress;
		});
	}

	ngOnDestroy() {
		this.addressSubscription.unsubscribe();
	}

	@DefaultAsyncAPIErrorHandling('property-details.contact-agent.contact-error')
	public async inviteSeller() {
		await this.smartContractConnectionService.markSellerInvitationSent(this.deedAddress);
		this.notificationService.pushSuccess({
			title: this.successMessage,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});
	}

}
