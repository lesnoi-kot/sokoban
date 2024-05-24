import { Feature, GameObject } from "./base";

export class Movable extends Feature {
  static $isMovable = Symbol("Collider");

  weight: number = 1;
  private pushedAt: number = Infinity;

  constructor(public readonly obj: GameObject) {
    super();
    obj[Movable.$isMovable] = true;
  }

  setPushed(ts: DOMHighResTimeStamp): void {
    if (!Number.isFinite(this.pushedAt)) {
      this.pushedAt = ts;
    }
  }

  setUnpushed(): void {
    this.pushedAt = Infinity;
  }

  getPushedAt(): number {
    return this.pushedAt;
  }
}
