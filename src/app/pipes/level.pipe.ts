import { Pipe, PipeTransform } from "@angular/core";
import { Level } from "../models/level.model";

@Pipe({ name: "level" })
export class LevelPipe implements PipeTransform {
  transform(id: number, levels: Level[]): string {
    const level = levels.find((x) => x.id === id);

    return `${level?.rows} X ${level?.cols} with ${level?.mines} mines.`;
  }
}
