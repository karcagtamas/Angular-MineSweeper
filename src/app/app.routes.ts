import { Routes } from '@angular/router';
import { gameGuard } from './guards/game.guard';
import { gameResolver } from './resolvers/game.resolver';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'game',
    loadComponent: () =>
      import('./pages/game/game.component').then((m) => m.GameComponent),
    canActivate: [gameGuard],
    resolve: {
      level: gameResolver,
    },
  },
];
