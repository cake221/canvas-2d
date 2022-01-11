import { Point } from "@canvas-2d/shared"
import { Frame } from "@canvas-2d/core"

export class ControlFrame {
  controlSize = 10

  boundingBox = new Frame()

  centerBox = new Frame(0, 0, this.controlSize, this.controlSize)

  get centerPoint() {
    return this.centerBox.centerPoint
  }

  controlPoints: Frame[] = new Array(9)
    .fill(0)
    .map(() => new Frame(0, 0, this.controlSize, this.controlSize))

  get rotateControl() {
    return this.controlPoints[4]
  }

  constructor(public eleFrame: Frame) {}

  render(ctx: CanvasRenderingContext2D, eleFrame: Frame) {
    this.eleFrame = eleFrame
    this.updateBoundingBox(ctx)
    this.updateControlPoints(ctx)
  }

  updateBoundingBox(ctx: CanvasRenderingContext2D) {
    const { boundingBox, eleFrame, controlSize } = this
    const { x, y, width, height } = eleFrame
    boundingBox.x = x - controlSize
    boundingBox.y = y - controlSize
    boundingBox.width = width + 2 * controlSize
    boundingBox.height = height + 2 * controlSize
    boundingBox.render(ctx, "rgba(0, 0, 0, 0)", "black")
  }

  updateControlPoints(ctx: CanvasRenderingContext2D) {
    const { controlSize, controlPoints } = this
    const { x, y, width, height } = this.boundingBox
    const wStep = width / 2
    const hStep = height / 2
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        controlPoints[i * 3 + j].x = x + wStep * i - controlSize / 2
        controlPoints[i * 3 + j].y = y + hStep * j - controlSize / 2
      }
    }
    this.centerBox.x = controlPoints[4].x
    this.centerBox.y = controlPoints[4].y
    controlPoints[4].y = controlPoints[4].y - hStep - controlSize * 2
    controlPoints.forEach((box) => box.render(ctx, "red"))
    this.centerBox.render(ctx, "blue")
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
