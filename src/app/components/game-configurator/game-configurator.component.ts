import { Component, model } from "@angular/core";
import { LEVELS, Level } from "../../models/level.model";
import { GameService } from "src/app/services/game.service";
import { Router } from "@angular/router";

@Component({
  selector: "app-game-configurator",
  templateUrl: "./game-configurator.component.html",
  styleUrl: "./game-configurator.component.scss",
})
export class GameConfiguratorComponent {
  protected levels: Level[] = LEVELS;
  protected selected: number | null = null;

  constructor(private service: GameService, private router: Router) {}

  select(id: number | null) {
    if (!id) {
      return;
    }

    const level = this.levels.find((x) => x.id === id);

    if (!level) {
      return;
    }

    this.service.level = level;

    this.router.navigateByUrl("/game");
  }
}
