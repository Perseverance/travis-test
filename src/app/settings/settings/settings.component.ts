import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AuthenticationService, UserData } from './../../authentication/authentication.service';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ProWalletComponent } from '../../pro-wallet/pro-wallet.component';
import { GeneralSettingsComponent } from '../general-settings/general-settings.component';
import { IntPhonePrefixComponent } from 'ng4-intl-phone/src/lib';

export const SETTINGS_TABS = {
	GENERAL: 'GENERAL',
	MY_LISTINGS: 'MY_LISTINGS',
	WALLET: 'WALLET',
	PASSWORD: 'PASSWORD',
	MY_DEALS: 'MY_DEALS',
	REFFERAL_LINK: 'REFFERAL_LINK'
};

// TODO: Make MY_DEALS 3, Passwords 4 and refferal 5

export const TABS_INDEX = {
	GENERAL: 0,
	MY_LISTINGS: 1,
	WALLET: 2,
	// MY_DEALS: 3,
	PASSWORD: 3,
	REFFERAL_LINK: 4
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

	private paramsSubscription: Subscription;

	constructor(private authService: AuthenticationService,
		private route: ActivatedRoute,
		private router: Router) {
	}

	async ngOnInit() {
		const currentUser = await this.authService.getCurrentUser();
		if (currentUser.data.data === null) {
			this.shouldShowPassword = true;
			this.paramsSubscription = this.setupParamsWatcher();
			return;
		}
		this.isEmailVerified = currentUser.data.data.isEmailVerified;
		if (currentUser.data.data.externalLoginProviders === null) {
			this.shouldShowPassword = true;
		} else {
			this.shouldShowPassword = currentUser.data.data.externalLoginProviders.length === 0;
		}
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
				break;
			}
			case TABS_INDEX.PASSWORD: {
				queryParams['selectedTab'] = SETTINGS_TABS.PASSWORD;
				break;
			}
			// TODO: Uncomment when we have my deals

			// case TABS_INDEX.MY_DEALS: {
			// 	queryParams['selectedTab'] = SETTINGS_TABS.MY_DEALS;
			// 	break;
			// }
			case TABS_INDEX.REFFERAL_LINK: {
				queryParams['selectedTab'] = SETTINGS_TABS.REFFERAL_LINK;
				break;
			}
			default: {
				queryParams['selectedTab'] = SETTINGS_TABS.GENERAL;
				break;
			}
		}

		const currentPath = window.location.pathname;
		this.router.navigate([currentPath], { queryParams: queryParams });
	}

}
