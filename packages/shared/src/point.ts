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

  countPointBaseRotate(rotate: Rotate) {
    return rotate.rotatePoint(this)
  }
}

export interface Rotate {
  angle: number
  angleCenter: Point
  takeEffect(ctx: CanvasRenderingContext2D): void
  rotatePoint(p: Point): Point
}

export class RotateImp implements Rotate {
  angle = 0
  angleCenter = Point.Zero()

  // 一个元素，只能有一次变换
  takeEffect(ctx: CanvasRenderingContext2D): void {
    const { angle, angleCenter } = this
    const { x, y } = angleCenter
    if (angle) {
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.translate(-x, -y)
    }
  }

  rotatePoint(p: Point) {
    const { angleCenter, angle } = this
    if (angle) {
      p = p.translatePoint(-angleCenter.x, -angleCenter.y)
      p = p.rotatePointOnZero(-angle)
      p = p.translatePoint(angleCenter.x, angleCenter.y)
    }
    return p
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
    const { offsetX, offsetY, scaleX, scaleY, angle, angleCenter } = this
    const { isReset = true, isScale = true, isTranslate = true, isRotate = true } = params
    isReset && ctx.resetTransform()

    isTranslate && ctx.translate(offsetX, offsetY)

    if (isRotate && angle) {
      const { x, y } = angleCenter
      if (angle) {
        ctx.translate(x, y)
        ctx.rotate(angle)
        ctx.translate(-x, -y)
      }
    }

    isScale && ctx.scale(scaleX, scaleY)
  }

  transFormPoint(p: Point, params: TransformParams = {}) {
    const { offsetX, offsetY, scaleX, scaleY, angleCenter, angle } = this
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

  isPointInFrame(point: Point, rotate?: Rotate) {
    const { x, y } = point
    const points = this.boxPoints
    const [p1, p2, p3, p4] = rotate ? points.map((p) => p.countPointBaseRotate(rotate)) : points
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
    const { fill = "#ffffff00", stroke = "#ffffff00" } = params
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
