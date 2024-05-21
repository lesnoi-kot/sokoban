export const $isCollider = Symbol("Collider");

export interface Collider {
  [$isCollider]: true;
  getHitBox(): DOMRectReadOnly;
  hitTest(other: Collider): boolean;
}

export const $isMovable = Symbol("Movable");

export interface Movable {
  [$isMovable]: true;
  weight: number;
  setUnpushed(): void;
  setPushed(): void;
  getPushedAt(): number;
}

export function isCollider(obj: any): obj is Collider {
  return obj?.[$isCollider] === true;
}

export function isMovable(obj: any): obj is Movable {
  return obj?.[$isMovable] === true;
}
