import { WORLD_UNIT_PX } from "./consts";

export type Stage = {
  readonly worldUnit: number;
  readonly rows: number;
  readonly cols: number;
};

type WorldUnit = number;
type GridUnit = number;

type CollisionResult = "block" | "pass";

export interface Collider {
  collideWith(): CollisionResult;
}

export class Sprite {
  sprite: string;
  spritePosition: [WorldUnit, WorldUnit] = [0, 0];

  row: GridUnit = 0;
  col: GridUnit = 0;
  cellWidth: GridUnit = 1;
  cellHeight: GridUnit = 1;

  offsetX: WorldUnit = 0;
  offsetY: WorldUnit = 0;
  classes: string | undefined;

  constructor(sprite: string, row: number = 0, col: number = 0) {
    this.sprite = sprite;
    this.row = row;
    this.col = col;
  }

  public withSpritePosition(x: WorldUnit, y: WorldUnit): Sprite {
    this.spritePosition = [x, y];
    return this;
  }

  public withClasses(classes: string): Sprite {
    this.classes = classes;
    return this;
  }

  public get imageSrc(): string {
    return `/${this.sprite}.png`;
  }

  public get imagePosition(): string | undefined {
    if (!this.spritePosition) {
      return undefined;
    }

    const [x, y] = this.spritePosition;
    return `${x * WORLD_UNIT_PX}px ${y * WORLD_UNIT_PX}px`;
  }

  public get gridArea(): string {
    return `${this.row} / ${this.col} / ${this.row + this.cellHeight} / ${this.col + this.cellWidth}`;
  }
}

// export class SpriteGroup extends Sprite {
// }

export type Player = {
  row: number;
  col: number;
  dir: "up" | "right" | "down" | "left";
};
