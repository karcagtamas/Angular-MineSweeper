import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Mine } from "../mine";

@Component({
  selector: "app-mine",
  templateUrl: "./mine.component.html",
  styleUrls: ["./mine.component.css"]
})
export class MineComponent implements OnInit {
  @Input() mine: Mine; // Input akna érték
  @Output() LeftClick = new EventEmitter(); // Bal Klikk esemány meghívása
  @Output() Bomb = new EventEmitter(); // Bomba esemény meghívása
  @Output() RightClick = new EventEmitter(); // Jobb Klikk esemény meghívása

  constructor() {}

  ngOnInit() {}

  // Bal klikk esemény
  // Ha akna, akkor a bomb esemény hívja meg, egyébként a Bal klikk eseményt
  leftClick() {
    if (!this.mine.isVisible && !this.mine.isMarked) {
      if (this.mine.isMine) this.Bomb.emit();
      else this.LeftClick.emit({ x: this.mine.x, y: this.mine.y });
    }
  }

  // Jobb klikk esemény
  // Ha nem látható, meghívja a Jobb klikk eseményt
  rightClick(event) {
    if (!this.mine.isVisible)
      this.RightClick.emit({ x: this.mine.x, y: this.mine.y });
    return false;
  }
}
