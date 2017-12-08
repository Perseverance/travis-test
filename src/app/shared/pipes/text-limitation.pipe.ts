import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'textLimitation'
})

export class TextLimitationPipe implements PipeTransform {
  private DEFAULT_TEXT_LIMIT = 250;
  transform(value: string, limit?: number) {
    if (!value) {
      throw new Error('No value for pipe supplied');
    }
    const actualLimit = (limit) ? limit : this.DEFAULT_TEXT_LIMIT;
    if (value.length <= actualLimit) {
      return value;
    }
    return value.substr(0, actualLimit) + '...';

  }

}