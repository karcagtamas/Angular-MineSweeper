import { inject } from "@angular/core";
import { ResolveFn } from "@angular/router";
import { GameService } from "../services/game.service";
import { Level } from "../models/level.model";

export const gameResolver: ResolveFn<Level> = (route, state) => {
  const service = inject(GameService);

  return service.level;
};
