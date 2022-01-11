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

  countPointBaseTransform(trans: Transform) {
    return trans.transFormPoint(this)
  }
}

export type TRANSFORM_MATRIX = [number, number, number, number, number, number]

export class Transform {
  offsetX = 0
  offsetY = 0
  angle = 0
  angleCenter = Point.Zero()
  scaleX = 1
  scaleY = 1

  takeEffect(ctx: CanvasRenderingContext2D) {
    const { offsetX, offsetY, angle, angleCenter, scaleX, scaleY } = this
    ctx.resetTransform()
    ctx.translate(offsetX, offsetY)
    ctx.translate(angleCenter.x, angleCenter.y)
    angle && ctx.rotate(angle)
    ctx.translate(-angleCenter.x, -angleCenter.y)
    ctx.scale(scaleX, scaleY)
  }

  transFormPoint(p: Point) {
    const { offsetX, offsetY, angleCenter, angle, scaleX, scaleY } = this
    p = p.translatePoint(-offsetX, -offsetY)
    p = p.translatePoint(-angleCenter.x, -angleCenter.y)
    p = p.rotatePointOnZero(-angle)
    p = p.translatePoint(angleCenter.x, angleCenter.y)
    p = p.scalePoint(1 / scaleX, 1 / scaleY)
    return p
  }
}
