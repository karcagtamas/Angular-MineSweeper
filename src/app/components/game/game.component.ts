import { Mine } from "../../models/mine";
import { Component, OnInit } from "@angular/core";
import { Level } from "../../models/level.model";
import { Coord } from "../../models/coord";
import { ActivatedRoute, Router } from "@angular/router";
import { ElapsedTime } from "src/app/models/time";

@Component({
  selector: "app-game",
  templateUrl: "./game.component.html",
  styleUrls: ["./game.component.scss"],
})
export class GameComponent implements OnInit {
  private readonly currentLevel: Level = {
    id: 0,
    rows: 9,
    cols: 9,
    mines: 10,
    name: "DEFAULT",
  };
  map: Mine[][] = []; // Pálya

  game: boolean = false; // Megy-e a játék (ha nem, nem jelenik meg a pálya)
  end: boolean = false; // Vége van-e a játéknak (ha nem, meg áll a játék és timer)
  protected message: string = ""; // Message

  protected status: { empty: number; correct: number; marked: number } = {
    empty: 0,
    correct: 0,
    marked: 0,
  };

  protected time: ElapsedTime = { day: 0, hour: 0, min: 0, sec: 0 }; // Idők: nap, óra, perc, másodperc
  private interval: NodeJS.Timeout | null = null; // Idő intervallum

  constructor(protected router: Router, route: ActivatedRoute) {
    const level: Level = route.snapshot.data.level;

    this.currentLevel = { ...level };
  }

  public get rows(): number {
    return this.currentLevel.rows;
  }

  public get cols(): number {
    return this.currentLevel.cols;
  }

  public get mines(): number {
    return this.currentLevel.mines;
  }

  ngOnInit(): void {}

  protected changeLevel() {
    this.router.navigateByUrl("/");
  }

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
          y: j + 1,
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
  leftClick(coord: Coord) {
    if (!this.end) {
      this.show(coord.x, coord.y);
      this.check();
    }
  }

  // Jobb klikk esemény
  // Ha nincs vége, akkor ha megjelölte kattintott, akkor deaktiválja, ha nem megjelöltre kattintott és még van kisoztható akna száma, akkor aktiválja a jelölést
  rightClick(coord: Coord) {
    if (!this.end) {
      if (this.map[coord.x - 1][coord.y - 1].isMarked)
        this.map[coord.x - 1][coord.y - 1].isMarked = false;
      else if (this.mines - this.status.marked != 0)
        this.map[coord.x - 1][coord.y - 1].isMarked = true;
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

  // Végig nézi a mezőket, megszámolje a bejelölteket, a jól bejelölteket és a felfedett mezőket
  // Ha sikerült a feladvány megoldása (minden ami nem akna látható és az aknák jelölve vannak)
  check(): void {
    let empty = 0;
    let correct = 0;
    let marked = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (this.map[i][j].isVisible && !this.map[i][j].isMine) empty++;
        if (this.map[i][j].isMarked && this.map[i][j].isMine) correct++;
        if (this.map[i][j].isMarked) marked++;
      }
    }

    this.status = { empty, correct, marked };

    if (this.status.empty + this.status.correct == this.cols * this.rows) {
      this.end = true;
      this.stopTimer();
      this.message = "Gratulálunk, nyertél!";
    }
  }

  // Időzítő
  // Nap, óra, perc, másodperc
  private startTimer(): void {
    this.interval = setInterval(() => {
      const time = { ...this.time };
      time.sec++;
      if (time.sec == 60) {
        time.min++;
        time.sec = 0;
      }
      if (time.min == 60) {
        time.hour++;
        time.min = 0;
      }
      if (time.hour == 24) {
        time.day++;
        time.hour = 0;
      }

      this.time = { ...time };
    }, 1000);
  }

  // Időzítő leállítása
  private stopTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }
}
