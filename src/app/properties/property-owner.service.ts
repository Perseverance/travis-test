import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { PropertiesService } from './properties.service';

@Injectable()
export class PropertyOwnerGuard {

	constructor(private propertiesService: PropertiesService) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean> {
		return this.propertiesService.isCurrentUserPropertyOwner(route.params['id']);
	}

}
