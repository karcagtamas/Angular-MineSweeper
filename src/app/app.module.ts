import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { GameComponent } from "./components/game/game.component";
import { MineComponent } from "./mine/mine.component";

import { MatCardModule } from "@angular/material/card";
import { MatButtonModule } from "@angular/material/button";
import { MatSelectModule } from "@angular/material/select";

import { CountPipe } from "./pipes/count.pipe"; // Darab pipe
import { SecondsPipe } from "./pipes/seconds.pipe"; // Másodperc pipe
import { MinutesPipe } from "./pipes/minutes.pipe"; // Perc pipe
import { HoursPipe } from "./pipes/hours.pipe"; // Óra pip
import { DayPipe } from "./pipes/day.pipe"; // Nap pip
import { provideAnimationsAsync } from "@angular/platform-browser/animations/async";
import { GameConfiguratorComponent } from "./components/game-configurator/game-configurator.component";
import { LevelPipe } from "./pipes/level.pipe";

const materialModules = [MatCardModule, MatButtonModule, MatSelectModule];

@NgModule({
  declarations: [
    AppComponent,
    GameComponent,
    GameConfiguratorComponent,
    MineComponent,
    CountPipe,
    SecondsPipe,
    HoursPipe,
    MinutesPipe,
    DayPipe,
    LevelPipe,
  ],
  imports: [BrowserModule, AppRoutingModule, ...materialModules],
  providers: [provideAnimationsAsync()],
  bootstrap: [AppComponent],
})
export class AppModule {}
