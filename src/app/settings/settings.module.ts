import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { TabViewModule } from 'primeng/components/tabview/tabview';
import { GeneralSettingsComponent } from './general-settings/general-settings.component';

@NgModule({
	imports: [
		CommonModule,
		SettingsRoutingModule,
		TabViewModule,
		TranslateModule
	],
	declarations: [SettingsComponent, GeneralSettingsComponent]
})
export class SettingsModule { }
