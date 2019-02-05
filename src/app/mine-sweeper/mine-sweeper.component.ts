import { Mine } from "./../mine";
import { Component, OnInit } from "@angular/core";
import { Level } from "../level.mode";
import { isNullOrUndefined } from "util";
import { checkAndUpdateBinding } from "@angular/core/src/view/util";

@Component({
  selector: "app-mine-sweeper",
  templateUrl: "./mine-sweeper.component.html",
  styleUrls: ["./mine-sweeper.component.css"]
})
export class MineSweeperComponent implements OnInit {
  Levels: Level[] = [
    { id: 1, mines: 10, cols: 9, rows: 9, name: "Könnyű" },
    { id: 2, mines: 40, cols: 16, rows: 16, name: "Nehéz" }
  ];
  rows: number = 9;
  cols: number = 9;
  mines: number = 10;
  map = [];
  game: boolean = false;
  end: boolean = false;
  message: string = "";
  empty: number = 0;
  correct: number = 0;
  marked: number = 0;
  time = { day: 0, hour: 0, min: 0, sec: 0 };
  interval;

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
    let db = this.mines;
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
    if (!this.end) {
      this.show(event.x, event.y);
      this.check();
    }
  }

  rightClick(event) {
    if (!this.end) {
      if (this.map[event.x - 1][event.y - 1].isMarked)
        this.map[event.x - 1][event.y - 1].isMarked = false;
      else if (this.mines - this.marked != 0)
        this.map[event.x - 1][event.y - 1].isMarked = true;
      this.check();
    }
  }

  show(x: number, y: number) {
    if (!this.map[x - 1][y - 1].isMarked) {
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
  }

  bomb() {
    this.end = true;
    this.stopTimer();
    this.message = "Legközelebb talán nagyobb szerencséd lesz!";
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
    this.stopTimer();
    this.time = { day: 0, hour: 0, min: 0, sec: 0 };
    this.startTimer();
  }

  reset(): void {
    this.map = [];
    this.genMap();
    this.genMines();
    this.genOthers();
    this.check();
  }

  changeLevel(level: number) {
    let Level: Level = this.Levels.find(element => element.id == level);
    if (!isNullOrUndefined(Level)) {
      this.cols = Level.cols;
      this.rows = Level.rows;
      this.mines = Level.mines;
      this.start();
    }
  }

  check(): void {
    this.empty = 0;
    this.correct = 0;
    this.marked = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.map[i][j].isVisible && !this.map[i][j].isMine) this.empty++;
        if (this.map[i][j].isMarked && this.map[i][j].isMine) this.correct++;
        if (this.map[i][j].isMarked) this.marked++;
      }
    }
    if (this.empty + this.correct == this.cols * this.rows) {
      this.end = true;
      this.stopTimer();
      this.message = "Gratulálunk, nyertél!";
    }
  }

  startTimer(): void {
    this.interval = setInterval(() => {
      this.time.sec++;
      if (this.time.sec == 60) {
        this.time.min++;
        this.time.sec = 0;
      }
      if (this.time.min == 60) {
        this.time.hour++;
        this.time.min = 0;
      }
      if (this.time.hour == 24) {
        this.time.day++;
        this.time.hour = 0;
      }
    }, 1000);
  }

  stopTimer(): void {
    clearInterval(this.interval);
  }
}
