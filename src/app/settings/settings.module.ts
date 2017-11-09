import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SettingsRoutingModule } from './settings-routing.module';
import { SettingsComponent } from './settings/settings.component';
import { TabViewModule } from 'primeng/components/tabview/tabview';

@NgModule({
	imports: [
		CommonModule,
		SettingsRoutingModule,
		TabViewModule
	],
	declarations: [SettingsComponent]
})
export class SettingsModule { }
