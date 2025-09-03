import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { GameComponent } from './components/game/game.component';
import { GameConfiguratorComponent } from './components/game-configurator/game-configurator.component';
import { TileComponent } from './components/tile/tile.component';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';

import { CountPipe } from './pipes/count.pipe';
import { LevelPipe } from './pipes/level.pipe';
import { ElapsedTimePipe } from './pipes/elapsed-time.pipe';

const materialModules = [MatCardModule, MatButtonModule, MatSelectModule];

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ...materialModules,
    GameComponent,
    GameConfiguratorComponent,
    TileComponent,
    CountPipe,
    LevelPipe,
    ElapsedTimePipe,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
