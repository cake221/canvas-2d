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

export type TRANSFORM_MATRIX = [number, number, number, number, number, number]

export function transformPoint(p: Point, t: TRANSFORM_MATRIX = [1, 0, 0, 0, 1, 0]) {
  return new Point(t[0] * p.x + t[2] * p.y + t[4], t[1] * p.x + t[3] * p.y + t[5])
}

export function translatePoint(p: Point, x: number = 0, y: number = 0) {
  return new Point(p.x + x, p.y + y)
}

export function scalePoint(p: Point, x: number = 1, y: number = 1) {
  return new Point(p.x * x, p.y * y)
}

export function rotatePoint(p: Point, a: number = 0) {
  return new Point(p.x * Math.cos(a) - p.y + Math.sin(a), p.x * Math.sin(a) + p.y + Math.cos(a))
}

export function renderPoints(ctx: CanvasRenderingContext2D, points: Point[], isClose = true) {
  ctx.save()
  ctx.beginPath()

  ctx.moveTo(points[0].x, points[0].y)
  points.slice(1).forEach((p) => ctx.lineTo(p.x, p.y))
  isClose && ctx.closePath()
  ctx.restore()
}
