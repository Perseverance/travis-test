import { MetaGuard } from '@ngx-meta/core';
import { TokenGuard } from './../authentication/token-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PurchaseComponent } from './purchase/purchase.component';

const routes: Routes = [
	{
		path: 'purchase/:id/:address',
		component: PurchaseComponent,
		canActivate: [TokenGuard, MetaGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PurchaseRoutingModule { }
