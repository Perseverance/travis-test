import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'replaceSpecialSymbols'})
export class ReplaceSpecialSymbolsPipe implements PipeTransform {
	transform(value: string): string {
		const newValue = value.replace('&amp;', '&');
		return `${newValue}`;
	}
}
