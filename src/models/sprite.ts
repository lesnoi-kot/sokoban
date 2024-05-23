import { Component, Signal, createSignal } from "solid-js";
import clsx from "clsx";

import { SpriteComponent } from "@/views";

import { Movable, $isMovable } from "./features";
import { GameObject, WorldUnit } from "./base";
import { BoxCollider } from "./colliders";
import { WORLD_UNIT_PX } from "./consts";

export class Sprite extends GameObject {
  sprite: string;
  spritePosition: [WorldUnit, WorldUnit] = [0, 0];
  offsetX: WorldUnit = 0;
  offsetY: WorldUnit = 0;
  classes: string | undefined;

  static View: Component<{ sprite: Sprite }> = SpriteComponent;
  private signal: Signal<undefined>;

  constructor(
    sprite: string,
    row: number = 0,
    col: number = 0,
    height: number = 1,
    width: number = 1,
  ) {
    super(row, col, height, width);
    this.sprite = sprite;
    this.signal = createSignal(undefined, { equals: false });
  }

  public subscribe(): false {
    this.signal[0]();
    return false;
  }

  public notify() {
    this.signal[1]();
  }

  public withSpritePosition(row: WorldUnit, col: WorldUnit): Sprite {
    this.spritePosition = [row, col];
    return this;
  }

  public withClasses(...classes: string[]): Sprite {
    this.classes = clsx(...classes);
    return this;
  }

  public get imageSrc(): string {
    return `/${this.sprite}.png`;
  }

  public get imagePosition(): string | undefined {
    if (!this.spritePosition) {
      return undefined;
    }

    const [row, col] = this.spritePosition;
    return `${col * WORLD_UNIT_PX}px ${row * WORLD_UNIT_PX}px`;
  }

  public get gridArea(): string {
    return `${this.row + 1} / ${this.col + 1} / ${this.row + this.height + 1} / ${this.col + this.width + 1}`;
  }
}

export class SolidSprite extends Sprite {
  constructor(...args: ConstructorParameters<typeof Sprite>) {
    super(...args);
    this.withFeatureClass(BoxCollider);
  }
}

export class MovableSprite extends SolidSprite implements Movable {
  [$isMovable]: true = true;
  weight: number = 1;
  private pushedAt: number = Infinity;

  setPushed(): void {
    if (!Number.isFinite(this.pushedAt)) {
      this.pushedAt = performance.now();
    }
  }

  setUnpushed(): void {
    this.pushedAt = Infinity;
  }

  getPushedAt(): number {
    return this.pushedAt;
  }
}

// export class SpriteGroup extends Sprite {}
