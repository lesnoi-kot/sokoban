import { hasOverlap, scaleRect } from "@/utils";

import { Sprite } from "./sprite";
import { $isCollider, Collider } from "./interfaces";

export class Player extends Sprite implements Collider {
  [$isCollider]: true = true;
  dir: "up" | "right" | "down" | "left" = "down";
  speed: number = 5;

  constructor(row: number, col: number) {
    super("cat64", row, col, 1, 1);
  }

  public getHitBox(): DOMRectReadOnly {
    const playerHitbox = scaleRect(
      new DOMRectReadOnly(this.col, this.row, 2 * this.height, 2 * this.width),
      0.5,
    );
    return playerHitbox;
  }

  hitTest(other: Collider): boolean {
    return hasOverlap(this.getHitBox(), other.getHitBox());
  }
}
