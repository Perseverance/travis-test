import { NgxStripeModule } from 'ngx-stripe';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PurchaseRoutingModule } from './purchase-routing.module';
import { PurchaseComponent } from './purchase/purchase.component';
import { environment } from '../../environments/environment';
import { TranslateModule } from '@ngx-translate/core';
import { ReserveService } from './reserve.service';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		ReactiveFormsModule,
		PurchaseRoutingModule,
		TranslateModule,
		NgxStripeModule.forRoot(environment.stripePublicKey),
	],
	declarations: [PurchaseComponent],
	providers: [
		ReserveService
	]
})
export class PurchaseModule { }
