import {MomentModule} from 'angular2-moment';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {SettingsRoutingModule} from './settings-routing.module';
import {SettingsComponent} from './settings/settings.component';
import {TabViewModule} from 'primeng/components/tabview/tabview';
import {GeneralSettingsComponent} from './general-settings/general-settings.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {MyListedPropertiesComponent} from './my-listed-properties/my-listed-properties.component';
import {SharedModule} from '../shared/shared.module';
import {ConfirmDialogModule, DataTableModule, GrowlModule} from 'primeng/primeng';
import {ProWalletModule} from '../pro-wallet/pro-wallet.module';
import {MyDealsComponent} from './my-deals/my-deals.component';
import {RefferalLinkComponent} from './refferal-link/refferal-link.component';
import {ClipboardModule} from 'ngx-clipboard/dist/src';
import {InternationalPhoneModule} from 'ng4-intl-phone/src/lib';
import { AcceptRejectPropertiesComponent } from './accept-reject-properties/accept-reject-properties.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SettingsRoutingModule,
		TabViewModule,
		TranslateModule,
		SharedModule,
		ConfirmDialogModule,
		GrowlModule,
		ProWalletModule,
		DataTableModule,
		MomentModule,
		ClipboardModule,
		InternationalPhoneModule
	],
	declarations: [SettingsComponent, GeneralSettingsComponent, ChangePasswordComponent, MyListedPropertiesComponent, MyDealsComponent, RefferalLinkComponent, AcceptRejectPropertiesComponent]
})
export class SettingsModule {
}
