import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { GameComponent } from "./components/game/game.component";
import { GameConfiguratorComponent } from "./components/game-configurator/game-configurator.component";
import { gameResolver } from "./resolvers/game.resolver";
import { gameGuard } from "./guards/game.guard";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: GameConfiguratorComponent,
  },
  {
    path: "game",
    component: GameComponent,
    canActivate: [gameGuard],
    resolve: {
      level: gameResolver,
    },
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
