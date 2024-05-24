import { flip } from "lodash";

import { distancePoint } from "@/lib/geometry";

import { GameObject, Feature } from "./base";

enum ColliderType {
  box,
  circle,
}

export const ORIGIN_CENTER = new DOMPointReadOnly(0.5, 0.5);
export const ORIGIN_TOP_LEFT = new DOMPointReadOnly(0, 0);

export abstract class Collider extends Feature {
  static $isCollider = Symbol("Collider");

  constructor(
    public readonly obj: GameObject,
    public readonly type: ColliderType,
    protected origin: DOMPoint,
  ) {
    super();
    obj[Collider.$isCollider] = true;
  }

  public hitTest(other: Collider): boolean {
    return hitTestResolver[this.type][other.type](this, other);
  }
}

export class BoxCollider extends Collider {
  constructor(
    obj: GameObject,
    public offset: DOMPoint = DOMPoint.fromPoint(ORIGIN_TOP_LEFT),
    public height: number = obj.height,
    public width: number = obj.width,
  ) {
    super(obj, ColliderType.box, DOMPoint.fromPoint(ORIGIN_TOP_LEFT));
  }

  public get top(): number {
    return this.obj.top + this.offset.y;
  }
  public get left(): number {
    return this.obj.left + this.offset.x;
  }
  public get right(): number {
    return this.left + this.width;
  }
  public get bottom(): number {
    return this.top + this.height;
  }
}

export class CircleCollider extends Collider {
  constructor(
    obj: GameObject,
    origin: DOMPoint = DOMPoint.fromPoint(ORIGIN_CENTER),
    public radius: number = obj.width / 2,
  ) {
    super(obj, ColliderType.circle, origin);
  }

  public getCenter(): DOMPointReadOnly {
    return new DOMPointReadOnly(
      this.obj.col + this.obj.width * this.origin.x,
      this.obj.row + this.obj.height * this.origin.y,
    );
  }
}

/*
  Hit test resolvers
*/
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

function boxBoxHitTest(b1: BoxCollider, b2: BoxCollider): boolean {
  if (b1.right <= b2.left || b2.right <= b1.left) {
    return false;
  }
  if (b1.bottom <= b2.top || b2.bottom <= b1.top) {
    return false;
  }
  return true;
}

function boxCircleHitTest(box: BoxCollider, circle: CircleCollider): boolean {
  const circleCenter = circle.getCenter();
  const closest = {
    x: Math.max(box.obj.left, Math.min(circleCenter.x, box.obj.right)),
    y: Math.max(box.obj.top, Math.min(circleCenter.y, box.obj.bottom)),
  };
  const distanceToClosestPoint = distancePoint(circleCenter, closest);
  return distanceToClosestPoint <= circle.radius;
}

function circleCircleHitTest(
  circle1: CircleCollider,
  circle2: CircleCollider,
): boolean {
  const centerDistance = distancePoint(
    circle1.getCenter(),
    circle2.getCenter(),
  );
  return centerDistance <= circle1.radius + circle2.radius;
}
