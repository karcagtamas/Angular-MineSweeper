export class Level {
  id: number; // Szint id
  rows: number; // Sorok
  cols: number; // Oszlopok
  mines: number; // Aknák
  name: string; // Név
}

export const LEVELS: Level[] = [
  { id: 1, mines: 10, cols: 9, rows: 9, name: "Easy" },
  { id: 2, mines: 18, cols: 12, rows: 12, name: "Medium" },
  { id: 3, mines: 40, cols: 16, rows: 16, name: "Hard" },
];
