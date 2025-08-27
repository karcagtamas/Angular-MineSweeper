import { Pipe, PipeTransform } from "@angular/core";

@Pipe({ name: "count" })
export class CountPipe implements PipeTransform {
  transform(value: number, args?: any): any {
    return value + " ct.";
  }
}
