import { Point } from "@canvas-2d/shared"
import { Frame, Shape, D_SHAPE, Element } from "@canvas-2d/core"

export class ControlFrame extends Frame {
  controlSize = 20

  get boundingBox(): Shape {
    const { x, y, width, height, controlSize } = this
    const boundingBoxData: D_SHAPE = {
      type: "shape",
      d_path: {
        type: "rect",
        x: x - controlSize,
        y: y - controlSize,
        width: width + 2 * controlSize,
        height: height + 2 * controlSize
      },
      stroke: "black"
    }
    return Shape.createObj(Shape, boundingBoxData)
  }

  constructor(x?: number, y?: number, width?: number, height?: number) {
    super(x, y, width, height)
  }

  render(ctx: CanvasRenderingContext2D, ele?: Element) {
    if (!ele) return
    const { x, y, width, height } = ele.elementFrame
    this.x = x
    this.y = y
    this.width = width
    this.height = height
    this.boundingBox.render(ctx)
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
    v2[0] * v3[1] - v3[0] * v2[1] > 0 &&
    v3[0] * v4[1] - v4[0] * v3[1] > 0 &&
    v4[0] * v1[1] - v1[0] * v4[1] > 0
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
