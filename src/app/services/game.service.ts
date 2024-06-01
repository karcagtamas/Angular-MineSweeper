import { Injectable } from "@angular/core";
import { Level } from "../models/level.model";

@Injectable({ providedIn: "root" })
export class GameService {
  private _level: Level | null = null;

  public get level(): Level | null {
    return this._level;
  }

  public set level(level: Level) {
    this._level = level;
  }

  public hasLevel(): boolean {
    return this.level != null;
  }
}
