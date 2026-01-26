import { Routes } from '@angular/router';
import { gameGuard } from './guards/game.guard';
import { gameResolver } from './resolvers/game.resolver';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/game-configurator/game-configurator.component').then(
        (m) => m.GameConfiguratorComponent,
      ),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./components/game/game.component').then((m) => m.GameComponent),
    canActivate: [gameGuard],
    resolve: {
      level: gameResolver,
    },
  },
];
