import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";


import { gameResolver } from "./resolvers/game.resolver";
import { gameGuard } from "./guards/game.guard";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    loadComponent: () => import('./components/game-configurator/game-configurator.component').then(m => m.GameConfiguratorComponent),
  },
  {
    path: "game",
    loadComponent: () => import('./components/game/game.component').then(m => m.GameComponent),
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
