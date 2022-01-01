export class Point {
  constructor(public x: number = 0, public y: number = 0) {}
}

export function point_add(
  a: Partial<Point> = { x: 0, y: 0 },
  b: Partial<Point> = { x: 0, y: 0 }
): Point {
  a = {
    x: a.x || 0,
    y: a.y || 0
  }

  b = {
    x: b.x || 0,
    y: b.y || 0
  }

  return new Point(a.x! + b.x!, a.y! + b.y!)
}
