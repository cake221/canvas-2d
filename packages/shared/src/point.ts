export class Point {
  constructor(public x: number = 0, public y: number = 0) {}

  clone() {
    return new Point(this.x, this.y)
  }

  static Zero() {
    return new Point(0, 0)
  }

  point_add(p: Point): Point {
    const { x, y } = this
    return new Point(x + p.x, y + p.y)
  }

  // https://harmonyos.51cto.com/posts/89
  countEndPointByRotate(centerPoint: Point = Point.Zero(), angle: number = 0) {
    const { x, y } = this
    const [centerX, centerY] = [centerPoint.x, centerPoint.y]
    const [x1, y1] = [x - centerX, y - centerY]
    const x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle)
    const y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle)
    return new Point(x2 + centerX, y2 + centerY)
  }

  rotatePointOnZero(a: number = 0) {
    const { x, y } = this
    return new Point(x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a))
  }

  transformPoint(t: TRANSFORM_MATRIX = [1, 0, 0, 0, 1, 0]) {
    const { x, y } = this
    return new Point(t[0] * x + t[2] * y + t[4], t[1] * x + t[3] * y + t[5])
  }

  translatePoint(offsetX: number = 0, offsetY: number = 0) {
    const { x, y } = this
    return new Point(x + offsetX, y + offsetY)
  }

  scalePoint(scaleX: number = 1, scaleY: number = 1) {
    const { x, y } = this
    return new Point(x * scaleX, y * scaleY)
  }
}

export type TRANSFORM_MATRIX = [number, number, number, number, number, number]
