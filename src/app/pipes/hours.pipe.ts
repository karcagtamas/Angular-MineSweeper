import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "hours"
})
export class HoursPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    return value + " óra";
  }
}
