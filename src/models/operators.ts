import { MovableSprite } from ".";
import { GameObject } from "./base";
import { Collider } from "./colliders";
import { $isMovable } from "./features";

function isCollider(obj: any) {
  return obj?.[Collider.$isCollider] === true;
}

export function isMovable(obj: any): obj is MovableSprite {
  return obj?.[$isMovable] === true;
}

export function hitTest(obj1: GameObject, obj2: GameObject): boolean {
  if (isCollider(obj1) && isCollider(obj2)) {
    return obj1.getFeature(Collider)!.hitTest(obj2.getFeature(Collider)!);
  }
  return false;
}
