import { BoxCollider } from "./colliders";
import { Sprite } from "./sprite";

const PLAYER_COLLIDER_SIZE = 0.8;

export class Player extends Sprite {
  dir: "up" | "right" | "down" | "left" = "down";
  speed: number = 5;

  constructor(row: number, col: number) {
    super("cat64", row, col, 1, 1);
    this.withFeature(
      new BoxCollider(
        this,
        new DOMPointReadOnly(0.5, 0.5),
        PLAYER_COLLIDER_SIZE,
        PLAYER_COLLIDER_SIZE,
      ),
    );
  }
}
