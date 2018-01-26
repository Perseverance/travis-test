import { Pipe, PipeTransform } from '@angular/core';
import { environment } from '../../environments/environment';

@Pipe({
	name: 'etherscan'
})
export class EtherscanPipe implements PipeTransform {

	transform(value: string, args?: any): any {
		const etherscanTxLink = environment.etherscanTxLink;
		return `${etherscanTxLink}${value}`;
	}

}
