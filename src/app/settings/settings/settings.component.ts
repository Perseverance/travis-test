import {Subscription} from 'rxjs/Subscription';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {AuthenticationService, UserData} from './../../authentication/authentication.service';
import {OnDestroy} from '@angular/core/src/metadata/lifecycle_hooks';
import {ProWalletComponent} from '../../pro-wallet/pro-wallet.component';
import {GeneralSettingsComponent} from '../general-settings/general-settings.component';
import {IntPhonePrefixComponent} from 'ng4-intl-phone/src/lib';

export const SETTINGS_TABS = {
	GENERAL: 'GENERAL',
	MY_LISTINGS: 'MY_LISTINGS',
	WALLET: 'WALLET',
	PASSWORD: 'PASSWORD',
	MY_DEALS: 'MY_DEALS',
	REFFERAL_LINK: 'REFFERAL_LINK'
};

export const TABS_INDEX = {
	GENERAL: 0,
	MY_LISTINGS: 1,
	WALLET: 2,
	MY_DEALS: 3,
	PASSWORD: 4,
	REFFERAL_LINK: 5
};

@Component({
	selector: 'app-settings',
	templateUrl: './settings.component.html',
	styleUrls: ['./settings.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class SettingsComponent implements OnInit, OnDestroy {

	public shouldShowPassword: any;
	public settingsTabs = SETTINGS_TABS;
	public selectedTab = this.settingsTabs.GENERAL;
	public isEmailVerified = true;
	public globalCountryCode: string;

	private paramsSubscription: Subscription;
	@ViewChild(ProWalletComponent) childProWalletComponent: ProWalletComponent;
	@ViewChild(GeneralSettingsComponent) childGeneralSettingsComponent: GeneralSettingsComponent;
	@ViewChild(IntPhonePrefixComponent) childPhoneComponent: IntPhonePrefixComponent;

	constructor(private authService: AuthenticationService,
				private route: ActivatedRoute,
				private router: Router) {
	}

	ngOnInit() {
		this.authService.subscribeToUserData({
			next: (userInfo: UserData) => {
				if (userInfo.user === null) {
					this.shouldShowPassword = true;
					return;
				}
				this.isEmailVerified = userInfo.user.isEmailVerified;
				if (userInfo.user.externalLoginProviders === null) {
					this.shouldShowPassword = true;
				} else {
					this.shouldShowPassword = userInfo.user.externalLoginProviders.length === 0;
				}
			}
		});
		this.paramsSubscription = this.setupParamsWatcher();
	}

	ngOnDestroy(): void {
		this.paramsSubscription.unsubscribe();
	}

	private setupParamsWatcher() {
		return this.route.queryParams
			.subscribe(params => {
				if (!params.selectedTab || !(params.selectedTab in this.settingsTabs)) {
					return;
				}

				if (!this.isEmailVerified) {
					this.setQueryParamForSelectedTab(TABS_INDEX.GENERAL);
					return;
				}

				this.selectedTab = params.selectedTab;
			});
	}

	public setQueryParamForSelectedTab(id: number) {
		const queryParams: Params = Object.assign({}, this.route.snapshot.queryParams);

		switch (id) {
			case TABS_INDEX.MY_LISTINGS: {
				queryParams['selectedTab'] = SETTINGS_TABS.MY_LISTINGS;
				break;
			}
			case TABS_INDEX.WALLET: {
				queryParams['selectedTab'] = SETTINGS_TABS.WALLET;
				this.childProWalletComponent.setPhone(this.globalCountryCode);
				break;
			}
			case TABS_INDEX.PASSWORD: {
				queryParams['selectedTab'] = SETTINGS_TABS.PASSWORD;
				break;
			}
			case TABS_INDEX.MY_DEALS: {
				queryParams['selectedTab'] = SETTINGS_TABS.MY_DEALS;
				break;
			}
			case TABS_INDEX.REFFERAL_LINK: {
				queryParams['selectedTab'] = SETTINGS_TABS.REFFERAL_LINK;
				break;
			}
			default: {
				queryParams['selectedTab'] = SETTINGS_TABS.GENERAL;
				this.childGeneralSettingsComponent.setPhone(this.globalCountryCode);
				break;
			}
		}

		const currentPath = window.location.pathname;
		this.router.navigate([currentPath], {queryParams: queryParams});
	}

	public updateGlobalCountryCode(event) {
		this.globalCountryCode = event;
	}
}
