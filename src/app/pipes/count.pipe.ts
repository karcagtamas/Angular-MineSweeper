import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: "count",
    standalone: false
})
export class CountPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    return value + " ct.";
  }
}
