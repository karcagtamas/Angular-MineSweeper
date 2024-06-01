import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { MineSweeperComponent } from "./mine-sweeper/mine-sweeper.component";

const routes: Routes = [
  {
    path: "",
    pathMatch: "full",
    component: MineSweeperComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
