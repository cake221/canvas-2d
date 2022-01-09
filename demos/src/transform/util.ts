import { Point } from "@canvas-2d/shared"

/**
 * 计算旋转角度
 *
 * @param {Array} centerPoint 旋转中心坐标
 * @param {Array} startPoint 旋转起点
 * @param {Array} endPoint 旋转终点
 *
 * @return {number} 旋转角度
 */

export function getRotateAngle(centerPoint: Point, startPoint: Point, endPoint: Point) {
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

export function getEndPointByRotate(startPoint: Point, centerPoint: Point, angle: number) {
  const [centerX, centerY] = [centerPoint.x, centerPoint.y]
  const [x1, y1] = [startPoint.x - centerX, startPoint.y - centerY]
  const x2 = x1 * Math.cos(angle) - y1 * Math.sin(angle)
  const y2 = x1 * Math.sin(angle) + y1 * Math.cos(angle)
  return [x2 + centerX, y2 + centerY]
}
