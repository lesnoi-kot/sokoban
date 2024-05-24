import { Component, createSignal } from "solid-js";
import clsx from "clsx";

import { SpriteComponent, SpriteGroupComponent } from "@/views";

import { GameObject, WorldUnit } from "./base";
import { BoxCollider } from "./colliders";
import { WORLD_UNIT_PX } from "./consts";

export abstract class Renderable extends GameObject {
  abstract get View(): Component<{ sprite: any }>;

  protected signal = createSignal(undefined, { equals: false });

  constructor(...args: ConstructorParameters<typeof GameObject>) {
    super(...args);
  }

  public subscribe(): false {
    this.signal[0]();
    return false;
  }

  public notify() {
    this.signal[1]();
  }

  get zIndex() {
    return this.parent?.row ?? this.row;
  }
}

export class Sprite extends Renderable {
  get View(): Component<{ sprite: Sprite }> {
    return SpriteComponent;
  }

  spritePosition: [WorldUnit, WorldUnit] = [0, 0];
  offset: [WorldUnit, WorldUnit] = [0, 0];
  classes: string | undefined;

  constructor(
    public sprite: string,
    ...args: ConstructorParameters<typeof Renderable>
  ) {
    super(...args);
  }

  public withSpritePosition(row: WorldUnit, col: WorldUnit): Sprite {
    this.spritePosition = [row, col];
    return this;
  }

  public withClasses(...classes: string[]): Sprite {
    this.classes = clsx(...classes);
    return this;
  }

  public withOffset(rowOffset: WorldUnit, colOffset: WorldUnit): Sprite {
    this.offset = [rowOffset, colOffset];
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
}

export class SolidSprite extends Sprite {
  constructor(...args: ConstructorParameters<typeof Sprite>) {
    super(...args);
    this.withFeatureClass(BoxCollider);
  }
}

export class SpriteGroup extends Renderable {
  get View(): Component<{ sprite: SpriteGroup }> {
    return SpriteGroupComponent;
  }

  constructor(
    public sprites: Renderable[],
    ...args: ConstructorParameters<typeof Renderable>
  ) {
    super(...args);
    for (const sprite of sprites) {
      sprite.parent = this;
    }
  }

  public moveBy(rows: number, cols: number): void {
    super.moveBy(rows, cols);
  }

  public notify(): void {
    super.notify();
    for (const sprite of this.sprites) {
      sprite.notify();
    }
  }
}
