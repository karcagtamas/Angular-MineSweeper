import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "day"
})
export class DayPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    return value + " nap";
  }
}
