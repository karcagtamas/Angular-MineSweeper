import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { Mine } from "../Mine";

@Component({
  selector: "app-mine",
  templateUrl: "./mine.component.html",
  styleUrls: ["./mine.component.css"]
})
export class MineComponent implements OnInit {
  @Input() mine: Mine;
  @Output() LeftClick = new EventEmitter();
  @Output() Bomb = new EventEmitter();
  @Output() RightClick = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  leftClick() {
    if (!this.mine.isVisible && !this.mine.isMarked) {
      if (this.mine.isMine) this.Bomb.emit();
      else this.LeftClick.emit({ x: this.mine.x, y: this.mine.y });
    }
  }

  rightClick() {
    if (!this.mine.isVisible)
      this.RightClick.emit({ x: this.mine.x, y: this.mine.y });
    return false;
  }
}
