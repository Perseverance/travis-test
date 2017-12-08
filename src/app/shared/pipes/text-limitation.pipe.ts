import { Pipe, PipeTransform } from '@angular/core';
const defaultValue = 250;
@Pipe({
  name: 'textLimitation'
})

export class TextLimitationPipe implements PipeTransform {

  transform(value: string, limit?: number) {
    if (!value) {
      throw new Error('No value for pipe supplied');
    }
    const actualLimit = (limit) ? limit : defaultValue;
    if (value.length < actualLimit) {
      return value;
    }
    return value.substr(0, actualLimit) + '...';

  }

}