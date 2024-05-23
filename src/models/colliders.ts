import { flip } from "lodash";

import { distance } from "@/lib/geometry";

import { GameObject, Feature } from "./base";

enum ColliderType {
  box,
  circle,
}

export abstract class Collider extends Feature {
  static $isCollider = Symbol("Collider");

  constructor(
    public readonly obj: GameObject,
    public readonly type: ColliderType,
  ) {
    super();
    obj[Collider.$isCollider] = true;
  }

  public hitTest(other: Collider): boolean {
    return hitTestResolver[this.type][other.type](this.obj, other.obj);
  }
}

export class BoxCollider extends Collider {
  constructor(obj: GameObject) {
    super(obj, ColliderType.box);
  }
}

export class CircleCollider extends Collider {
  constructor(obj: GameObject) {
    super(obj, ColliderType.circle);
  }
}

const hitTestResolver = {
  [ColliderType.box]: {
    [ColliderType.box]: boxBoxHitTest,
    [ColliderType.circle]: boxCircleHitTest,
  },
  [ColliderType.circle]: {
    [ColliderType.box]: flip(boxCircleHitTest),
    [ColliderType.circle]: circleCircleHitTest,
  },
} as const;

function boxBoxHitTest(obj1: GameObject, obj2: GameObject): boolean {
  if (obj1.right <= obj2.left || obj2.right <= obj1.left) {
    return false;
  }
  if (obj1.bottom <= obj2.top || obj2.bottom <= obj1.top) {
    return false;
  }
  return true;
}

function boxCircleHitTest(box: GameObject, circle: GameObject): boolean {
  const circleRadius = circle.width / 2;
  const circleCenterX = circle.col + circleRadius;
  const circleCenterY = circle.row + circleRadius;
  const closestX = Math.max(box.left, Math.min(circleCenterX, box.right));
  const closestY = Math.max(box.top, Math.min(circleCenterY, box.bottom));
  const distanceToClosestPoint = distance(
    circleCenterX,
    circleCenterY,
    closestX,
    closestY,
  );
  return distanceToClosestPoint <= circleRadius;
}

function circleCircleHitTest(
  circle1: GameObject,
  circle2: GameObject,
): boolean {
  const radius1 = circle1.width / 2;
  const centerX1 = circle1.col + radius1;
  const centerY1 = circle1.row + radius1;
  const radius2 = circle2.width / 2;
  const centerX2 = circle2.col + radius2;
  const centerY2 = circle2.row + radius2;
  const centerDistance = distance(centerX1, centerY1, centerX2, centerY2);
  return centerDistance <= radius1 + radius2;
}
