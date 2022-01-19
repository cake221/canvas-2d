import { Point, Box } from "@canvas-2d/shared"

export class ControlFrame {
  controlSize = 10

  boundingBox = new Box()

  angleCenterBox!: Box

  get centerPoint() {
    return this.angleCenterBox.centerPoint
  }

  controlPoints: Box[] = new Array(9)
    .fill(0)
    .map(() => new Box(0, 0, this.controlSize, this.controlSize))

  get rotateControl() {
    return this.controlPoints[4]
  }

  eleFrame!: Box

  constructor() {}

  render(ctx: CanvasRenderingContext2D, eleFrame: Box) {
    this.eleFrame = eleFrame
    this.angleCenterBox = Box.fromPoint(
      this.eleFrame.centerPoint,
      this.controlSize,
      this.controlSize
    )
    this.updateBoundingBox(ctx)
    this.updateControlPoints(ctx)
  }

  updateBoundingBox(ctx: CanvasRenderingContext2D) {
    const { boundingBox, eleFrame, controlSize } = this
    const { boxX, boxY, boxWidth, boxHeight } = eleFrame
    boundingBox.boxX = boxX - controlSize
    boundingBox.boxY = boxY - controlSize
    boundingBox.boxWidth = boxWidth + 2 * controlSize
    boundingBox.boxHeight = boxHeight + 2 * controlSize
    boundingBox.render(ctx, { stroke: "black" })
  }

  updateControlPoints(ctx: CanvasRenderingContext2D) {
    const { controlSize, controlPoints } = this
    const { boxX, boxY, boxWidth, boxHeight } = this.boundingBox
    const wStep = boxWidth / 2
    const hStep = boxHeight / 2
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        controlPoints[i * 3 + j].boxX = boxX + wStep * i - controlSize / 2
        controlPoints[i * 3 + j].boxY = boxY + hStep * j - controlSize / 2
      }
    }
    controlPoints[4].boxY = controlPoints[4].boxY - hStep - controlSize * 2
    controlPoints.forEach((box) => box.render(ctx, { fill: "red" }))
    // 不渲染旋转坐标
    this.angleCenterBox.render(ctx, { fill: "gray" })
  }

  // https://harmonyos.51cto.com/posts/89
  countRotateAngle(startPoint: Point, endPoint: Point) {
    const { x, y } = this.centerPoint
    const [rotateStartX, rotateStartY] = [startPoint.x, startPoint.y]
    const [touchX, touchY] = [endPoint.x, endPoint.y]
    // 两个向量
    const v1 = [rotateStartX - x, rotateStartY - y]
    const v2 = [touchX - x, touchY - y]
    // 公式的分子
    const numerator = v1[0] * v2[1] - v1[1] * v2[0]
    // 公式的分母
    const denominator =
      Math.sqrt(Math.pow(v1[0], 2) + Math.pow(v1[1], 2)) *
      Math.sqrt(Math.pow(v2[0], 2) + Math.pow(v2[1], 2))
    const sin = numerator / denominator
    return Math.asin(sin)
  }
}
