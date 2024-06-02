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

  /**
   * Generate the rows and columns. All cells have basic settings and coordinate data.
   */
  private generateMap(): void {
    for (let i = 0; i < this.rows; i++) {
      let row: Mine[] = [];
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
        row.push(mine);
      }
      this.map.push(row);
    }
  }

  /**
   * Select mine tiles randomly.
   */
  private selectMines(mines: number): void {
    let db = mines;
    let x = 0;
    let y = 0;
    do {
      x = Math.floor(Math.random() * this.rows);
      y = Math.floor(Math.random() * this.cols);
      if (!this.map[x][y].isMine) {
        db--;
        this.map[x][y].isMine = true;
        this.map[x][y].value = -1;
      }
    } while (db > 0);
  }

  /**
   * Calculate the values of the cells. The cell value is equal to the count of the mine neighbours.
   */
  private calculateMineNeighbours(): void {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = this.map[i][j];
        if (cell.isMine) {
          this.walkthroughNeighbours(i, j, (x, y) => {
            const inner = this.map[x][y];

            if (!inner.isMine) {
              inner.value = inner.value + 1;
            }
          });
        }
      }
    }
  }

  /**
   * Handle left click. Show the tile and check the game status.
   * @param coord The clicked coordinate
   */
  protected leftClick(coord: Coord) {
    if (!this.end) {
      this.show(coord.x, coord.y);
      this.check();
    }
  }

  /**
   * Handle right click. Mark or dismark the selected tile.
   * @param coord The clicked coordinate
   */
  protected rightClick(coord: Coord) {
    if (!this.end) {
      const cell = this.map[coord.x - 1][coord.y - 1];
      if (this.mines - this.status.marked !== 0 || cell.isMarked) {
        cell.isMarked = !cell.isMarked;
      }

      this.check();
    }
  }

  // Az x és y koordinátán lévő elemet megjeleníti ha nincs megjelölve és ha az értéke 0, akkor felderíti a környékét
  /**
   * Show tile on the X and Y coordinate. If the tile has 0 value, the the neighbours will appear recursively
   * @param x X
   * @param y Y
   */
  protected show(x: number, y: number) {
    const cell = this.map[x - 1][y - 1];
    if (!cell.isMarked && !cell.isMine) {
      cell.isVisible = true;

      // Show neighbours
      if (cell.value == 0) {
        this.walkthroughNeighbours(x - 1, y - 1, (xi, yj) => {
          const inner = this.map[xi][yj];

          if (!inner.isVisible) {
            this.show(xi + 1, yj + 1);
          }
        });
      }
    }
  }

  /**
   * Handle click on bomb. It stops the game and the timer.
   */
  protected bomb() {
    this.end = true;
    this.stopTimer();
    this.message = "Have luck next time!";

    // Show
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = this.map[i][j];
        if (cell.isMine) {
          cell.isVisible = true;
        }
      }
    }
  }

  /**
   * Make the game ready and start it.
   */
  protected start(): void {
    this.end = false;
    this.game = true;
    this.reset();
    this.stopTimer();
    this.time = { day: 0, hour: 0, min: 0, sec: 0 };
    this.startTimer();
  }

  /**
   * Reset game state
   */
  private reset(): void {
    this.map = [];
    this.message = "";
    this.generateMap();
    this.selectMines(this.mines);
    this.calculateMineNeighbours();
    this.check();
  }

  /**
   * Checking the game state. Count the empty cells, correctly marked cells and just marked cells. Finish the game when all mine is marked.
   */
  private check(): void {
    let empty = 0;
    let correct = 0;
    let marked = 0;
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const cell = this.map[i][j];

        if (cell.isVisible && !cell.isMine) {
          empty++;
        }

        if (cell.isMarked) {
          marked++;
          if (cell.isMine) {
            correct++;
          }
        }
      }
    }

    this.status = { empty, correct, marked };

    if (this.status.empty + this.status.correct == this.cols * this.rows) {
      this.end = true;
      this.stopTimer();
      this.message = "Congratulations, you win!";
    }
  }

  /**
   * Start Timer and parse
   */
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

  /**
   * Stop Timer
   */
  private stopTimer(): void {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private walkthroughNeighbours(
    i: number,
    j: number,
    fn: (x: number, y: number) => void
  ): void {
    for (let x = Math.max(i - 1, 0); x <= Math.min(i + 1, this.rows - 1); x++) {
      for (
        let y = Math.max(j - 1, 0);
        y <= Math.min(j + 1, this.cols - 1);
        y++
      ) {
        fn(x, y);
      }
    }
  }
}
