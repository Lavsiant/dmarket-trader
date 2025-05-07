import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat'
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number): string {
    if (isNaN(value)) {
      return '';
    }
    const formattedValue = (value / 100).toFixed(2);
    return `${formattedValue}$`;
  }
}