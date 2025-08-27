import { Component, inject } from "@angular/core";
import { LEVELS, Level } from "../../models/level.model";
import { GameService } from "src/app/services/game.service";
import { Router } from "@angular/router";
import {
  MatCard,
  MatCardHeader,
  MatCardTitle,
  MatCardContent,
  MatCardActions,
} from "@angular/material/card";
import {
  MatFormField,
  MatLabel,
  MatSelect,
  MatOption,
} from "@angular/material/select";
import { MatButton } from "@angular/material/button";
import { LevelPipe } from "../../pipes/level.pipe";

@Component({
  selector: "app-game-configurator",
  templateUrl: "./game-configurator.component.html",
  styleUrl: "./game-configurator.component.scss",
  imports: [
    MatCard,
    MatCardHeader,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatLabel,
    MatSelect,
    MatOption,
    MatCardActions,
    MatButton,
    LevelPipe,
  ],
})
export class GameConfiguratorComponent {
  private service = inject(GameService);
  private router = inject(Router);

  protected levels: Level[] = LEVELS;
  protected selected: number | null = null;

  constructor() {}

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
