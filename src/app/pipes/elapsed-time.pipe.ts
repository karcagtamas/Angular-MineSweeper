import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'elapsedTime' })
export class ElapsedTimePipe implements PipeTransform {
  transform(value: number): string {
    const hours = Math.floor(value / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = value % 60;

    return `${hours} hour(s) ${minutes} minute(s) ${seconds} second(s)`;
  }
}
