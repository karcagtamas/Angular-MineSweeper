import { BrowserModule } from "@angular/platform-browser";
import { NgModule } from "@angular/core";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { MineSweeperComponent } from "./mine-sweeper/mine-sweeper.component";
import { MineComponent } from "./mine/mine.component";

import { CountPipe } from "./pipes/count.pipe"; // Darab pipe
import { SecondsPipe } from "./pipes/seconds.pipe"; // Másodperc pipe
import { MinutesPipe } from "./pipes/minutes.pipe"; // Perc pipe
import { HoursPipe } from "./pipes/hours.pipe"; // Óra pip
import { DayPipe } from "./pipes/day.pipe"; // Nap pip

@NgModule({
  declarations: [
    AppComponent,
    MineSweeperComponent,
    MineComponent,
    CountPipe,
    SecondsPipe,
    HoursPipe,
    MinutesPipe,
    DayPipe
  ],
  imports: [BrowserModule, AppRoutingModule],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}
