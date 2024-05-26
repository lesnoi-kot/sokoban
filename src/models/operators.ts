import { GameObject } from "./base";
import { Collider } from "./colliders";
import { Movable } from "./movable";

export function isCollider(obj: any): obj is {
  getFeature(FeatureClass: typeof Collider): Collider;
} {
  return obj?.[Collider.$isCollider];
}

export function isMovable(obj: any): obj is {
  getFeature(FeatureClass: typeof Movable): Movable;
} {
  return obj?.[Movable.$isMovable];
}

export function hitTest(obj1: GameObject, obj2: GameObject): boolean {
  if (isCollider(obj1) && isCollider(obj2)) {
    return obj1.getFeature(Collider)!.hitTest(obj2.getFeature(Collider)!);
  }
  return false;
}
