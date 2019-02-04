export class Mine {
  id: number;
  x: number;
  y: number;
  isMine: boolean;
  value: number; // null - mine, 0 - nothing, 1-5 numbers
  isMarked: boolean;
  isVisible: boolean;
}
