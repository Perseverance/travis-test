import { MetaGuard } from '@ngx-meta/core';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TokenGuard } from '../authentication/token-guard.service';
import { ListPropertyComponent } from './list-property/list-property.component';

const routes: Routes = [
	{
		path: 'property/:id',
		component: PropertyDetailsComponent,
		canActivate: [TokenGuard, MetaGuard]
	},
	{
		path: 'list-property',
		component: ListPropertyComponent,
		canActivate: [TokenGuard, MetaGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PropertiesRoutingModule {
}
