import { CircleCollider } from "./colliders";
import { Sprite } from "./sprite";

const PLAYER_COLLIDER_SIZE = 0.5;

export class Player extends Sprite {
  dir: "up" | "right" | "down" | "left" = "down";
  speed: number = 5;

  constructor(row: number, col: number) {
    super("cat64", row, col, 2, 2);
    this.withFeature(new CircleCollider(this, PLAYER_COLLIDER_SIZE));
  }
}
