import {Pipe, PipeTransform} from '@angular/core';
import {UserRoleEnum} from '../../transaction-tool/enums/user-role.enum';

@Pipe({name: 'userRole'})
export class UserRoleByTypePipe implements PipeTransform {

	transform(value: number): string {
		switch (value) {
			case UserRoleEnum.SellerBroker: {
				return 'Seller Broker';
			}
			case UserRoleEnum.BuyerBroker: {
				return 'Buyer Broker';
			}
			case UserRoleEnum.Seller: {
				return 'Seller';
			}
			case UserRoleEnum.TitleCompany: {
				return 'Title Company';
			}
			default: {
				return 'Buyer';
			}
		}
	}
}
