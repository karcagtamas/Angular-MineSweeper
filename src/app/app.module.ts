import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MineSweeperComponent } from './mine-sweeper/mine-sweeper.component';
import { MineComponent } from './mine/mine.component';

@NgModule({
  declarations: [
    AppComponent,
    MineSweeperComponent,
    MineComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
