import { flip } from "lodash";

import { distancePoint } from "@/lib/geometry";

import { GameObject, Feature, Vector } from "./base";

enum ColliderType {
  box,
  circle,
}

export abstract class Collider extends Feature {
  static $isCollider = Symbol("Collider");

  static: boolean = true;

  constructor(
    obj: GameObject,
    public readonly type: ColliderType,
  ) {
    super(obj);
    obj[Collider.$isCollider] = true;
  }

  public hitTest(other: Collider): boolean {
    if (this.disabled || other.disabled) {
      return false;
    }
    // @ts-ignore
    return hitTestResolver[this.type][other.type](this, other);
  }

  public abstract get top(): number;
  public abstract get left(): number;
  public abstract get right(): number;
  public abstract get bottom(): number;
  public abstract set top(top: number);
  public abstract set left(left: number);
  public abstract set right(right: number);
  public abstract set bottom(top: number);

  public get width(): number {
    return this.right - this.left;
  }

  public get height(): number {
    return this.bottom - this.top;
  }
}

export class BoxCollider extends Collider {
  constructor(
    obj: GameObject,
    public offset: Vector = new Vector(0, 0),
    private _height: number = obj.height,
    private _width: number = obj.width,
  ) {
    super(obj, ColliderType.box);
  }

  public get top(): number {
    return this.obj.top + this.offset.row;
  }
  public get left(): number {
    return this.obj.left + this.offset.col;
  }
  public get right(): number {
    return this.left + this._width;
  }
  public get bottom(): number {
    return this.top + this._height;
  }
  public get width(): number {
    return this._width;
  }
  public get height(): number {
    return this._height;
  }

  public set top(top: number) {
    this.obj.row = top - this.offset.row;
  }
  public set bottom(bottom: number) {
    this.obj.row = bottom - this._height - this.offset.row;
  }
  public set left(left: number) {
    this.obj.col = left - this.offset.col;
  }
  public set right(right: number) {
    this.obj.col = right - this._width - this.offset.col;
  }
}

export class CircleCollider extends Collider {
  constructor(
    obj: GameObject,
    public radius: number = obj.width / 2,
    public origin: Vector = new Vector(0.5, 0.5),
  ) {
    super(obj, ColliderType.circle);
  }

  public getCenter(): Vector {
    return new Vector(
      this.obj.row + this.obj.height * this.origin.y,
      this.obj.col + this.obj.width * this.origin.x,
    );
  }

  public get top(): number {
    return this.getCenter().row - this.radius;
  }

  public get left(): number {
    return this.getCenter().col - this.radius;
  }

  public get right(): number {
    return this.getCenter().col + this.radius;
  }

  public get bottom(): number {
    return this.getCenter().row + this.radius;
  }

  public get width(): number {
    return this.radius * 2;
  }

  public get height(): number {
    return this.radius * 2;
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
  if (b1.right < b2.left || b2.right < b1.left) {
    return false;
  }
  if (b1.bottom < b2.top || b2.bottom < b1.top) {
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
