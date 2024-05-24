type Point = { x: number; y: number };

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
