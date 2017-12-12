import {Pipe, PipeTransform} from '@angular/core';
import {UserRoleEnum} from '../../transaction-tool/enums/user-role.enum';

@Pipe({name: 'userRole'})
export class UserRoleByTypePipe implements PipeTransform {

	transform(value: number): string {
		switch (value) {
			case UserRoleEnum.Agent: {
				return 'Broker';
			}
			case UserRoleEnum.Seller: {
				return 'Seller';
			}
			case UserRoleEnum.Escrow: {
				return 'Title Company';
			}
			default: {
				return 'Buyer';
			}
		}
	}
}
