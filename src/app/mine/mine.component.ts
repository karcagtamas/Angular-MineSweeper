import { Component, Output, EventEmitter, input, output } from "@angular/core";
import { Mine } from "../models/mine";
import { Coord } from "../models/coord";

@Component({
  selector: "app-mine",
  templateUrl: "./mine.component.html",
  styleUrls: ["./mine.component.scss"],
})
export class MineComponent {
  protected mine = input.required<Mine>(); // Mine

  protected leftClick = output<Coord>();
  protected rightClick = output<Coord>();
  protected bomb = output<void>();

  /**
   * Handling left click
   * If the tile is mine, call bomb event, otherwise the left click event will be called
   */
  handleLeftClick() {
    this.withMine((mine) => {
      if (!mine.isVisible && !mine.isMarked) {
        if (mine.isMine) {
          this.bomb.emit();
        } else {
          this.leftClick.emit({ x: mine.x, y: mine.y });
        }
      }
    });
  }

  /**
   * Handling right click
   * If it's not visible, it will call the right click event
   */
  handleRightClick() {
    this.withMine((mine) => {
      if (!mine.isVisible) {
        this.rightClick.emit({ x: mine.x, y: mine.y });
      }
    });
    return false;
  }

  private withMine(fn: (mine: Mine) => void): void {
    const mine = this.mine();

    if (mine) {
      fn(mine);
    }
  }
}
