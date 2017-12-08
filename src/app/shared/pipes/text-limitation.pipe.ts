import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textLimitation'
})
export class TextLimitationPipe implements PipeTransform {

  transform(value: string, limit?: number) {
    if (!value) {
      return null;
    }
    const actualLimit = (limit) ? limit : 50;
    return value.substr(0, actualLimit) + '...';

  }

}