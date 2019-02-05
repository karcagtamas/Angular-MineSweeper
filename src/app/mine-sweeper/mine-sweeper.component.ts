import { Mine } from "./../mine";
import { Component, OnInit } from "@angular/core";
import { Level } from "../level.model";
import { isNullOrUndefined } from "util";
import { checkAndUpdateBinding } from "@angular/core/src/view/util";

@Component({
  selector: "app-mine-sweeper",
  templateUrl: "./mine-sweeper.component.html",
  styleUrls: ["./mine-sweeper.component.css"]
})
export class MineSweeperComponent implements OnInit {
  // Szintek
  Levels: Level[] = [
    { id: 1, mines: 10, cols: 9, rows: 9, name: "Könnyű" },
    { id: 2, mines: 40, cols: 16, rows: 16, name: "Nehéz" }
  ];
  rows: number = 9; // Sorok
  cols: number = 9; // Oszlopok
  mines: number = 10; // Aknák
  map = []; // Pálya

  game: boolean = false; // Megy-e a játék (ha nem, nem jelenik meg a pálya)
  end: boolean = false; // Vége van-e a játéknak (ha nem, meg áll a játék és timer)
  message: string = ""; // Jtál vége értesítése

  empty: number = 0; // Felderített nem aknák száma
  correct: number = 0; // Megjelölt aknák száma
  marked: number = 0; // Megjelöltek száma

  time = { day: 0, hour: 0, min: 0, sec: 0 }; // Idők: nap, óra, perc, másodperc
  interval; // Idő intervallum

  constructor() {}

  ngOnInit() {}

  // Pálya generálás (elemek legenárálása)
  // Alap adatok: nem megjelölt, nem látható, nem akna, x és y pozició, érték nulla, id (sorszám)
  // Sorok legenerálása és annak beszórása a map listába
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

  // Megfelelő számú aknál legenerálása
  // Addig keres helyet, míg meg nem lesz pontosan a kellő szám
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

  // Minden mezőre kiszámolja, hogy hány akna van a környékén és az lesz az értéke
  // Végig nézi a nyolc szomszédos mezőt (persze ha van annyi)
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

  // Bal klikk eseménye
  // Ha nincs vége, akkor az adott elem legyen látható, majd ellenőrzés
  leftClick(event) {
    if (!this.end) {
      this.show(event.x, event.y);
      this.check();
    }
  }

  // Jobb klikk esemény
  // Ha nincs vége, akkor ha megjelölte kattintott, akkor deaktiválja, ha nem megjelöltre kattintott és még van kisoztható akna száma, akkor aktiválja a jelölést
  rightClick(event) {
    if (!this.end) {
      if (this.map[event.x - 1][event.y - 1].isMarked)
        this.map[event.x - 1][event.y - 1].isMarked = false;
      else if (this.mines - this.marked != 0)
        this.map[event.x - 1][event.y - 1].isMarked = true;
      this.check();
    }
  }

  // Az x és y koordinátán lévő elemet megjeleníti ha nincs megjelölve és ha az értéke 0, akkor felderíti a környékét
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

  // Ha bombára kattinott felderítit az összes bombát, megállítja a jtálkot és a timert
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

  // Start esemény, beállítja a jtákot jtákhoz készen
  // Elinditja a játékot (változó szinten), reseteli a pályát, megállítja a timert, és újraidnítja
  start(): void {
    this.end = false;
    this.game = true;
    this.reset();
    this.stopTimer();
    this.time = { day: 0, hour: 0, min: 0, sec: 0 };
    this.startTimer();
  }

  // Visszaállítja a pályát alapra
  reset(): void {
    this.map = [];
    this.genMap();
    this.genMines();
    this.genOthers();
    this.check();
  }

  // Megváltoztatja a nehzségi szintet az input alapján (1-es vagy 2-es)
  changeLevel(level: number) {
    let Level: Level = this.Levels.find(element => element.id == level);
    if (!isNullOrUndefined(Level)) {
      this.cols = Level.cols;
      this.rows = Level.rows;
      this.mines = Level.mines;
      this.start();
    }
  }

  // Végig nézi a mezőket, megszámolje a bejelölteket, a jól bejelölteket és a felfedett mezőket
  // Ha sikerült a feladvány megoldása (minden ami nem akna látható és az aknák jelölve vannak)
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

  // Időzítő
  // Nap, óra, perc, másodperc
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

  // Időzítő leállítása
  stopTimer(): void {
    clearInterval(this.interval);
  }
}
