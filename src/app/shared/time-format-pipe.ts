import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'timeFormat'
})
export class TimeFormatPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';

    const [hourStr, minute] = value.split(':');
    let hour = parseInt(hourStr, 10);
    const suffix = hour >= 12 ? 'p.m.' : 'a.m.';
    hour = hour % 12 || 12;

    return `${hour}:${minute} ${suffix}`;
  }
}
