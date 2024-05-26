type Point = { x: number; y: number };

export function isZero(n: number, tolerance: number = Number.EPSILON): boolean {
  return Math.abs(n) < tolerance;
}

export function coerceToZero(
  n: number,
  tolerance: number = Number.EPSILON,
): number {
  return isZero(n, tolerance) ? 0 : n;
}

export function distancePoint(p1: Point, p2: Point): number {
  return Math.hypot(p2.x - p1.x, p2.y - p1.y);
}

export function distance(
  x1: number,
  y1: number,
  x2: number,
  y2: number,
): number {
  return Math.hypot(x2 - x1, y2 - y1);
}
