import { Point } from "@canvas-2d/shared"
import { Frame } from "@canvas-2d/core"

import { getRotateAngle } from "./util"

export class ControlFrame {
  controlSize = 20

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

  countRotateAngle(startPoint: Point, endPoint: Point) {
    return getRotateAngle(this.centerPoint, startPoint, endPoint)
  }
}
