import { SolidSprite, Sprite } from "./sprite";

export class DummyCollider extends SolidSprite {
  constructor(
    row: number = 0,
    col: number = 0,
    height: number = 1,
    width: number = 1,
  ) {
    super("", row, col, height, width);
  }
}

export class CraftsSprite extends Sprite {}
