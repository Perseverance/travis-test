import { PropertyOwnerGuard } from './property-owner.service';
import { MetaGuard } from '@ngx-meta/core';
import { PropertyDetailsComponent } from './property-details/property-details.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TokenGuard } from '../authentication/token-guard.service';
import { PropertyListingComponent } from './property-listing/property-listing.component';
import { EditListingComponent } from './edit-listing/edit-listing.component';

const routes: Routes = [
	{
		path: 'property/:id',
		component: PropertyDetailsComponent,
		canActivate: [TokenGuard, MetaGuard]
	},
	{
		path: 'property/:id/:userId',
		component: PropertyDetailsComponent,
		canActivate: [TokenGuard, MetaGuard]
	},
	{
		path: 'property/:id/edit',
		component: EditListingComponent,
		canActivate: [TokenGuard, MetaGuard, PropertyOwnerGuard]
	},
	{
		path: 'list-property',
		component: PropertyListingComponent,
		canActivate: [TokenGuard, MetaGuard]
	}
];

@NgModule({
	imports: [RouterModule.forChild(routes)],
	exports: [RouterModule]
})
export class PropertiesRoutingModule {
}
