import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { GameService } from "../services/game.service";

export const gameGuard: CanActivateFn = (route, state) => {
  const service = inject(GameService);

  const valid = service.hasLevel();

  if (!valid) {
    const router = inject(Router);

    router.navigateByUrl("/");
  }

  return valid;
};
