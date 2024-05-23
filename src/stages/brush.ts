import { GameObject, SolidSprite, Sprite } from "@/models";
import { BoxCollider } from "@/models/colliders";

export class EditorBrush {
  private row: number;
  private col: number;
  private staged: GameObject[] = [];
  private prefab: Sprite;

  constructor(row: number, col: number, prefab: Sprite) {
    this.row = row;
    this.col = col;
    this.prefab = prefab;
  }

  addRight(repeat: number = 1) {
    while (repeat-- > 0) {
      const sprite: Sprite = new SolidSprite(
        this.prefab.sprite,
        this.row,
        this.col,
        this.prefab.height,
        this.prefab.width,
      );
      sprite
        .withSpritePosition(...this.prefab.spritePosition)
        .withClasses(this.prefab.classes ?? "");
      // this.row += sprite.height;
      this.col += sprite.width;
      this.staged.push(sprite);
    }
    return this;
  }

  newLine() {
    this.row += 1;
    return this;
  }

  commit(makeCollider: boolean = false): GameObject[] {
    if (makeCollider) {
      this.staged.push(
        new GameObject(
          this.staged[0]?.row ?? 0,
          this.staged[0]?.col ?? 0,
          this.prefab.height,
          this.prefab.width * this.staged.length,
        ).withFeatureClass(BoxCollider),
      );
    }
    return this.staged;
  }
}
