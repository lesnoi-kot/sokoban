export type WorldUnit = number;
export type GridUnit = number;

export class GameObject {
  row: GridUnit;
  col: GridUnit;
  width: GridUnit;
  height: GridUnit;

  constructor(
    row: number = 0,
    col: number = 0,
    height: number = 1,
    width: number = 1,
  ) {
    this.row = row;
    this.col = col;
    this.height = height;
    this.width = width;
  }

  public moveBy(rows: number, cols: number) {
    this.row += rows;
    this.col += cols;
  }

  public get area(): number {
    return this.height * this.width;
  }

  public isCellInside(row: number, col: number): boolean {
    return (
      row >= this.row &&
      col >= this.col &&
      row <= this.row + this.height &&
      col <= this.col + this.width
    );
  }
}
