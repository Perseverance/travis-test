import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { TabViewModule } from 'primeng/components/tabview/tabview';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { MyListedPropertiesComponent } from './my-listed-properties/my-listed-properties.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		SettingsRoutingModule,
		TabViewModule,
		TranslateModule
	],
	declarations: [SettingsComponent, GeneralSettingsComponent, ChangePasswordComponent, MyListedPropertiesComponent]
})
export class SettingsModule { }
