import { TranslateModule } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VerificationRoutingModule } from './verification-routing.module';
import { VerificationComponent } from './verification/verification.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		VerificationRoutingModule,
		TranslateModule
	],
	declarations: [VerificationComponent]
})
export class VerificationModule { }
