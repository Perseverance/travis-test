import {PropertyDetailsComponent} from './property-details/property-details.component';
import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {TokenGuard} from '../authentication/token-guard.service';

const routes: Routes = [
	{
		path: 'property/:id',
		component: PropertyDetailsComponent,
		canActivate: [TokenGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PropertiesRoutingModule {
}
