import { Component } from '@angular/core';
import {
  MatCard,
  MatCardTitle,
  MatCardContent,
  MatCardHeader,
} from '@angular/material/card';
import { GameConfiguratorComponent } from 'src/app/components/game-configurator/game-configurator.component';

@Component({
  selector: 'app-home',
  imports: [
    MatCard,
    MatCardTitle,
    MatCardContent,
    MatCardHeader,
    GameConfiguratorComponent,
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
