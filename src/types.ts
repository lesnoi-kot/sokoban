import { JSXElement } from "solid-js";

import { WORLD_UNIT_PX } from "./consts";

export type Stage = {
  readonly worldUnit: number;
  readonly rows: number;
  readonly cols: number;
  tiles: JSXElement;
  sprites: Sprite[];
};

type WorldUnit = number;
type GridUnit = number;

type CollisionResult = "block" | "pass";

export interface Collider {
  getHitBox(): DOMRectReadOnly;
}

export class Sprite implements Collider {
  sprite: string;
  spritePosition: [WorldUnit, WorldUnit] = [0, 0];

  row: GridUnit = 0;
  col: GridUnit = 0;
  cellWidth: GridUnit = 1;
  cellHeight: GridUnit = 1;

  offsetX: WorldUnit = 0;
  offsetY: WorldUnit = 0;
  classes: string | undefined;

  // @ts-expect-error
  private hitbox: DOMRectReadOnly;

  constructor(
    sprite: string,
    row: number = 0,
    col: number = 0,
    height: number = 1,
    width: number = 1,
  ) {
    this.sprite = sprite;
    this.row = row;
    this.col = col;
    this.cellHeight = height;
    this.cellWidth = width;

    this.calculateHitBox();
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
    return `${this.row + 1} / ${this.col + 1} / ${this.row + this.cellHeight + 1} / ${this.col + this.cellWidth + 1}`;
  }

  private calculateHitBox(): void {
    this.hitbox = new DOMRectReadOnly(
      this.col,
      this.row,
      this.cellWidth,
      this.cellHeight,
    );
  }

  public getHitBox(): DOMRectReadOnly {
    return this.hitbox;
  }
}

// export class SpriteGroup extends Sprite {
// }

export type Player = {
  row: number;
  col: number;
  dir: "up" | "right" | "down" | "left";
  speed: number;
};
