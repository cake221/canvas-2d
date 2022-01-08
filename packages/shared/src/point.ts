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

export class Frame {
  constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}

  // 边框的四个点的坐标: 左上、右上、左下、右下
  framePoints(): [Point, Point, Point, Point] {
    const { x, y, width, height } = this
    return [
      new Point(x, y),
      new Point(x + width, y),
      new Point(x, y + height),
      new Point(x + width, y + height)
    ]
  }

  renderFrame(ctx: CanvasRenderingContext2D) {
    const { x, y, width, height } = this
    ctx.save()
    // TODO
    ctx.restore()
  }
}

// https://harmonyos.51cto.com/posts/89
/**
 * 判断落点是否在长方形内
 */
export function isPointInRect(point: Point, rect: Frame) {
  const [x, y] = [point.x, point.y]

  const [p1, p2, p3, p4] = rect.framePoints()
  // 四个向量
  const v1 = [p1.x - x, p1.y - y]
  const v2 = [p2.x - x, p2.y - y]
  const v3 = [p3.x - x, p3.y - y]
  const v4 = [p4.x - x, p4.y - y]
  if (
    v1[0] * v2[1] - v2[0] * v1[1] > 0 &&
    v2[0] * v4[1] - v4[0] * v2[1] > 0 &&
    v4[0] * v3[1] - v3[0] * v4[1] > 0 &&
    v3[0] * v1[1] - v1[0] * v3[1] > 0
  ) {
    return true
  }
  return false
}

/**
 * 计算旋转角度
 *
 * @param {Array} centerPoint 旋转中心坐标
 * @param {Array} startPoint 旋转起点
 * @param {Array} endPoint 旋转终点
 *
 * @return {number} 旋转角度
 */

function getRotateAngle(centerPoint: Point, startPoint: Point, endPoint: Point) {
  const [centerX, centerY] = [centerPoint.x, centerPoint.y]
  const [rotateStartX, rotateStartY] = [startPoint.x, startPoint.y]
  const [touchX, touchY] = [endPoint.x, endPoint.y]
  // 两个向量
  const v1 = [rotateStartX - centerX, rotateStartY - centerY]
  const v2 = [touchX - centerX, touchY - centerY]
  // 公式的分子
  const numerator = v1[0] * v2[1] - v1[1] * v2[0]
  // 公式的分母
  const denominator =
    Math.sqrt(Math.pow(v1[0], 2) + Math.pow(v1[1], 2)) *
    Math.sqrt(Math.pow(v2[0], 2) + Math.pow(v2[1], 2))
  const sin = numerator / denominator
  return Math.asin(sin)
}

/**
 *
 * 根据旋转起点、旋转中心和旋转角度计算旋转终点的坐标
 *
 * @param {Array} startPoint  起点坐标
 * @param {Array} centerPoint  旋转点坐标
 * @param {number} angle 旋转角度
 *
 * @return {Array} 旋转终点的坐标
 */

function getEndPointByRotate(startPoint: Point, centerPoint: Point, angle: number) {
  const [centerX, centerY] = [centerPoint.x, centerPoint.y]
  const [x1, y1] = [startPoint.x - centerX, startPoint.y - centerY]
  const x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle)
  const y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle)
  return [x2 + centerX, y2 + centerY]
}

export type TRANSFORM_MATRIX = [number, number, number, number, number, number]

function transformPoint(p: Point, t: TRANSFORM_MATRIX, ignoreOffset = false) {
  if (ignoreOffset) {
    return new Point(t[0] * p.x + t[2] * p.y, t[1] * p.x + t[3] * p.y)
  }
  return new Point(t[0] * p.x + t[2] * p.y + t[4], t[1] * p.x + t[3] * p.y + t[5])
}
