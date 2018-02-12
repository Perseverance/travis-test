import { VerificationService } from './../verification.service';
import { ErrorsService } from './../../shared/errors/errors.service';
import { ErrorsDecoratableComponent } from './../../shared/errors/errors.decoratable.component';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { DefaultAsyncAPIErrorHandling } from '../../shared/errors/errors.decorators';
import { TranslateService } from '@ngx-translate/core';
import { NotificationsService } from '../../shared/notifications/notifications.service';

@Component({
	selector: 'app-verification',
	templateUrl: './verification.component.html',
	styleUrls: ['./verification.component.scss']
})
export class VerificationComponent extends ErrorsDecoratableComponent implements OnInit, OnDestroy {

	private codeSubscription: Subscription;
	public resendForm: FormGroup;
	private verificationSuccess: string;
	private resendSuccess: string;
	public verificationTouched = false;
	public hasDataLoaded = false;
	public isIosDeviceDetected: boolean;
	public isFirefoxDetected: boolean;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private formBuilder: FormBuilder,
		private notificationsService: NotificationsService,
		private verificationService: VerificationService,
		errorsService: ErrorsService,
		translateService: TranslateService
	) {
		super(errorsService, translateService);
		this.resendForm = this.formBuilder.group({
			email: ['',
				[Validators.required, Validators.email]
			]
		});
	}

	ngOnInit() {
		this.isIosDeviceDetected = !!navigator.platform && /iPad|iPhone|iPod/.test(navigator.platform);
		this.isFirefoxDetected = (navigator.userAgent.toLowerCase().indexOf('firefox') > -1);
		console.log(this.isFirefoxDetected);
		this.translateService.get([
			'verification.successfull-verification',
			'verification.resend-success'
		]).subscribe((translations) => {
			this.verificationSuccess = translations['verification.successfull-verification'];
			this.resendSuccess = translations['verification.resend-success'];
			this.codeSubscription = this.setupQueryParamsWatcher();
		});
	}

	ngOnDestroy(): void {
		this.codeSubscription.unsubscribe();
	}

	private setupQueryParamsWatcher() {
		return this.route.queryParams
			.subscribe(async params => {
				if (params.code && params.email) {
					if (this.isIosDeviceDetected && !this.isFirefoxDetected) {
						window.location.href = `propy://verifyemail?email=${params.email}&code=${params.code}`;
						setTimeout(async () => {
							await this.sendActivationCode(params.code, params.email);
							this.hasDataLoaded = true;
						}, 1000);
					} else {
						await this.sendActivationCode(params.code, params.email);
					}
				} else {
					this.errorsService.pushError({
						errorMessage: 'Malformed Link. Please try again the link in your email or resend your activation email below',
						errorTitle: 'Malformed link.',
						errorTime: (new Date()).getTime()
					});
					this.hasDataLoaded = true;
				}

			});
	}

	@DefaultAsyncAPIErrorHandling('verification.verification-error')
	private async sendActivationCode(code: string, email: string) {
		try {
			await this.verificationService.sendVerificationCode(code, email);
			this.notificationsService.pushSuccess({
				title: this.verificationSuccess,
				message: '',
				time: (new Date().getTime()),
				timeout: 4000
			});
			this.moveToHome();
		} catch (error) {
			this.hasDataLoaded = true;
			throw error;
		}
	}

	public get email() {
		return this.resendForm.get('email');
	}

	@DefaultAsyncAPIErrorHandling('verification.resend-error')
	public async resendVerification() {
		this.verificationTouched = true;
		if (this.resendForm.invalid) {
			return;
		}
		await this.verificationService.resendVerficiation(this.email.value);
		this.notificationsService.pushSuccess({
			title: this.resendSuccess,
			message: '',
			time: (new Date().getTime()),
			timeout: 4000
		});

		this.verificationTouched = false;
	}

	private moveToHome() {
		this.router.navigate(['/']);
	}

}
