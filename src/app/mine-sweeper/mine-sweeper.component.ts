import { Mine } from "./../mine";
import { Component, OnInit } from "@angular/core";

@Component({
  selector: "app-mine-sweeper",
  templateUrl: "./mine-sweeper.component.html",
  styleUrls: ["./mine-sweeper.component.css"]
})
export class MineSweeperComponent implements OnInit {
  size: number = 100;
  rows: number = 10;
  cols: number = 10;
  map = [];
  game: boolean = false;
  end: boolean = false;

  constructor() {}

  ngOnInit() {}

  genMap(): void {
    for (let i = 0; i < this.rows; i++) {
      let list: Mine[] = [];
      for (let j = 0; j < this.cols; j++) {
        let mine: Mine = {
          value: 0,
          id: i * this.cols + j + 1,
          isMarked: false,
          isMine: false,
          isVisible: false,
          x: i + 1,
          y: j + 1
        };
        list.push(mine);
      }
      this.map.push(list);
    }
  }

  genMines(): void {
    let db = this.size / 10;
    let x = 0;
    let y = 0;
    do {
      x = Math.floor(Math.random() * this.rows);
      y = Math.floor(Math.random() * this.cols);
      if (!this.map[x][y].isMine) {
        db--;
        this.map[x][y].isMine = true;
      }
    } while (db > 0);
  }

  genOthers(): void {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (!this.map[i][j].isMine) {
          let count = 0;
          if (i != 0) {
            if (this.map[i - 1][j].isMine) count++;
          }
          if (i != this.rows - 1) {
            if (this.map[i + 1][j].isMine) count++;
          }
          if (j != 0) {
            if (this.map[i][j - 1].isMine) count++;
          }
          if (j != this.cols - 1) {
            if (this.map[i][j + 1].isMine) count++;
          }
          if (i != 0 && j != 0) {
            if (this.map[i - 1][j - 1].isMine) count++;
          }
          if (i != 0 && j != this.cols - 1) {
            if (this.map[i - 1][j + 1].isMine) count++;
          }
          if (i != this.rows - 1 && j != 0) {
            if (this.map[i + 1][j - 1].isMine) count++;
          }
          if (i != this.rows - 1 && j != this.cols - 1) {
            if (this.map[i + 1][j + 1].isMine) count++;
          }
          this.map[i][j].value = count;
        } else this.map[i][j].value = -1;
      }
    }
  }

  leftClick(event) {
    if (!this.end) this.show(event.x, event.y);
  }

  rightClick(event) {
    if (!this.end) {
      if (this.map[event.x - 1][event.y - 1].isMarked)
        this.map[event.x - 1][event.y - 1].isMarked = false;
      else this.map[event.x - 1][event.y - 1].isMarked = true;
    }
  }

  show(x: number, y: number) {
    this.map[x - 1][y - 1].isVisible = true;
    if (this.map[x - 1][y - 1].value == 0) {
      if (x != 1) {
        if (!this.map[x - 2][y - 1].isVisible) this.show(x - 1, y);
      }
      if (x != this.rows) {
        if (!this.map[x][y - 1].isVisible) this.show(x + 1, y);
      }
      if (y != 1) {
        if (!this.map[x - 1][y - 2].isVisible) this.show(x, y - 1);
      }
      if (y != this.cols) {
        if (!this.map[x - 1][y].isVisible) this.show(x, y + 1);
      }
      if (x != 1 && y != 1) {
        if (!this.map[x - 2][y - 2].isVisible) this.show(x - 1, y - 1);
      }
      if (x != 1 && y != this.cols) {
        if (!this.map[x - 2][y].isVisible) this.show(x - 1, y + 1);
      }
      if (x != this.rows && y != 1) {
        if (!this.map[x][y - 2].isVisible) this.show(x + 1, y - 1);
      }
      if (x != this.rows && y != this.cols) {
        if (!this.map[x][y].isVisible) this.show(x + 1, y + 1);
      }
    }
  }

  bomb() {
    this.end = true;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.map[i][j].isMine) this.map[i][j].isVisible = true;
      }
    }
  }

  start(): void {
    this.end = false;
    this.game = true;
    this.reset();
  }

  reset(): void {
    this.map = [];
    this.genMap();
    this.genMines();
    this.genOthers();
  }
}
