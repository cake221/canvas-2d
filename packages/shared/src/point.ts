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

  countPointBaseTransform(trans: Transform, transParams?: TransformParams) {
    return trans.transFormPoint(this, transParams)
  }
}

export type TRANSFORM_MATRIX = [number, number, number, number, number, number]

interface TransformParams {
  isScale?: boolean
  isTranslate?: boolean
  isRotate?: boolean
  isReset?: boolean
}

export class Transform {
  offsetX = 0
  offsetY = 0
  angle = 0
  angleCenter = Point.Zero()
  scaleX = 1
  scaleY = 1

  takeEffect(ctx: CanvasRenderingContext2D, params: TransformParams = {}) {
    const { offsetX, offsetY, angle, angleCenter, scaleX, scaleY } = this
    const { isReset = true, isScale = true, isTranslate = true, isRotate = true } = params
    isReset && ctx.resetTransform()

    isTranslate && ctx.translate(offsetX, offsetY)

    if (isRotate && angle) {
      ctx.translate(angleCenter.x, angleCenter.y)
      ctx.rotate(angle)
      ctx.translate(-angleCenter.x, -angleCenter.y)
    }

    isScale && ctx.scale(scaleX, scaleY)
  }

  transFormPoint(p: Point, params: TransformParams = {}) {
    const { offsetX, offsetY, angleCenter, angle, scaleX, scaleY } = this
    const { isReset = true, isScale = true, isTranslate = true, isRotate = true } = params
    isTranslate && (p = p.translatePoint(-offsetX, -offsetY))

    if (isRotate && angle) {
      p = p.translatePoint(-angleCenter.x, -angleCenter.y)
      p = p.rotatePointOnZero(-angle)
      p = p.translatePoint(angleCenter.x, angleCenter.y)
    }

    isScale && (p = p.scalePoint(1 / scaleX, 1 / scaleY))
    return p
  }
}

interface BoxRenderParam {
  fill?: string
  stroke?: string
}

export class Box {
  constructor(
    public boxX: number = 0,
    public boxY: number = 0,
    public boxWidth: number = 0,
    public boxHeight: number = 0
  ) {}

  get centerPoint(): Point {
    const { boxX, boxY, boxWidth, boxHeight } = this
    return new Point(boxX + boxWidth / 2, boxY + boxHeight / 2)
  }

  static fromPoint(p: Point, width = 5, height = 5): Box {
    return new Box(p.x - width / 2, p.y - height / 2, height, width)
  }

  // 边框的四个点的坐标: 左上、右上、右下、左下
  get boxPoints(): [Point, Point, Point, Point] {
    const { boxX, boxY, boxWidth, boxHeight } = this
    return [
      new Point(boxX, boxY),
      new Point(boxX + boxWidth, boxY),
      new Point(boxX + boxWidth, boxY + boxHeight),
      new Point(boxX, boxY + boxHeight)
    ]
  }

  isPointInFrame(point: Point) {
    const { x, y } = point
    const points = this.boxPoints
    const [p1, p2, p3, p4] = points
    // 四个向量
    const v1 = [p1.x - x, p1.y - y]
    const v2 = [p2.x - x, p2.y - y]
    const v3 = [p3.x - x, p3.y - y]
    const v4 = [p4.x - x, p4.y - y]
    if (
      v1[0] * v2[1] - v2[0] * v1[1] > 0 &&
      v2[0] * v3[1] - v3[0] * v2[1] > 0 &&
      v3[0] * v4[1] - v4[0] * v3[1] > 0 &&
      v4[0] * v1[1] - v1[0] * v4[1] > 0
    ) {
      return true
    }
    return false
  }

  render(ctx: CanvasRenderingContext2D, params: BoxRenderParam = {}) {
    const [p1, p2, p3, p4] = this.boxPoints
    const { fill = "rgba(0, 0, 0, 0)", stroke = "rgba(0, 0, 0, 0)" } = params
    ctx.save()
    ctx.fillStyle = fill
    ctx.strokeStyle = stroke
    ctx.beginPath()
    ctx.moveTo(p1.x, p1.y)
    ctx.lineTo(p2.x, p2.y)
    ctx.lineTo(p3.x, p3.y)
    ctx.lineTo(p4.x, p4.y)
    ctx.closePath()
    ctx.fill()
    ctx.stroke()
    ctx.restore()
  }
}
