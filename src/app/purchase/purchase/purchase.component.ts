import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { ReserveService } from './../reserve.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { NotificationsService } from './../../shared/notifications/notifications.service';
import { TranslateService } from '@ngx-translate/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { environment } from './../../../environments/environment';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, ViewChild, ViewEncapsulation, OnDestroy } from '@angular/core';
import { StripeService, StripeCardComponent, ElementOptions, ElementsOptions } from 'ngx-stripe';
import { ErrorsService } from '../../shared/errors/errors.service';

@Component({
	selector: 'app-purchase',
	templateUrl: './purchase.component.html',
	styleUrls: ['./purchase.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class PurchaseComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	@ViewChild(StripeCardComponent) card: StripeCardComponent;

	public stripeForm: FormGroup;
	public elementsOptions: ElementsOptions;

	public successTitle: string;
	public successMessage: string;
	public errorMessage: string;
	public hasUserLoaded = false;
	public isUserAnonymous: boolean;

	private idSubscription: Subscription;

	private propertyId: string;

	constructor(
		private router: Router,
		private route: ActivatedRoute,
		public authService: AuthenticationService,
		private formBuilder: FormBuilder,
		private stripeService: StripeService,
		private notificationService: NotificationsService,
		translateService: TranslateService,
		errorsService: ErrorsService,
		private reserveService: ReserveService) {
		super(errorsService, translateService);
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				this.isUserAnonymous = userInfo.isAnonymous;
				this.hasUserLoaded = true;
			}
		});

		this.translateService.stream([
			'purchase.successfull-reservation',
			'purchase.error-reserving',
			'purchase.successfull-message'
		]).subscribe((translations) => {
			this.successTitle = translations['purchase.successfull-reservation'];
			this.successMessage = translations['purchase.successfull-message'];
			this.errorMessage = translations['purchase.error-reserving'];
		});

		this.stripeForm = this.formBuilder.group({
			name: ['', [Validators.required]]
		});
	}


	public cardOptions: ElementOptions = {
		style: {
			base: {
				color: '#32325d',
				fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
				fontSmoothing: 'antialiased',
				fontSize: '16px',
				'::placeholder': {
					color: '#aab7c4'
				}
			},
			invalid: {
				color: '#fa755a',
				iconColor: '#fa755a'
			}
		}
	};

	ngOnInit() {
		const self = this;
		const idObservable: Observable<string> = self.route.params.map(p => p.id);
		this.idSubscription = idObservable.subscribe(async function (propertyId) {
			if (!propertyId) {
				throw new Error('No property id supplied');
			}
			self.propertyId = propertyId;
		});
	}

	ngOnDestroy() {
		this.idSubscription.unsubscribe();
	}

	public get name() {
		return this.stripeForm.get('name');
	}

	public reserveProperty() {
		this.notificationService.pushInfo({
			title: 'Sending data...',
			message: '',
			time: (new Date().getTime()),
			timeout: 15000
		});
		const name = this.name.value;
		this.stripeService
			.createToken(this.card.getCard(), { name })
			.subscribe(async result => {
				if (result.token) {
					await this.reserveService.reserveProperty(this.propertyId, result.token.id);
					this.notificationService.pushSuccess({
						title: this.successTitle,
						message: this.successMessage,
						time: (new Date().getTime()),
						timeout: 5000
					});
					this.goToProperty(this.propertyId);
				} else if (result.error) {
					this.errorsService.pushError({
						errorTitle: this.errorMessage,
						errorMessage: result.error.message,
						errorTime: (new Date()).getTime()
					});
					console.error(result.error.message);
				}
			});
	}

	private goToProperty(id: string) {
		this.router.navigate(['property', id]);
	}

}
