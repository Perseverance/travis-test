import { TokenGuard } from './../authentication/token-guard.service';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VerificationComponent } from './verification/verification.component';

const routes: Routes = [
	{
		path: 'verification',
		component: VerificationComponent,
		canActivate: [TokenGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class VerificationRoutingModule { }
