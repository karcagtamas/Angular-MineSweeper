import { Pipe, PipeTransform } from "@angular/core";
import { ElapsedTime } from "../models/time";

@Pipe({
  name: "elapsedTime",
})
export class ElapsedTimePipe implements PipeTransform {
  transform(value: ElapsedTime): unknown {
    return `${value.day} day(s) ${value.hour} hour(s) ${value.min} minute(s) ${value.sec} second(s)`;
  }
}
