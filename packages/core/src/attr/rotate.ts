import { Point } from "@canvas-2d/shared"

import { Attribute } from "./_attr"
import { D_ROTATE } from "../type"

export class Rotate extends Attribute implements D_ROTATE {
  public type: string = "attr_rotate"

  public ATTRIBUTE_NAMES: (keyof D_ROTATE)[] = ["angleCenterX", "angleCenterY", "angle"]

  angle?: number
  angleCenter?: Point

  setAngleCenter(p: Point) {
    this.angleCenter = p.clone()
  }

  // 一个元素，只能有一次变换
  takeEffect(ctx: CanvasRenderingContext2D, angleIncr: number = 0): void {
    let { angle = 0, angleCenter = Point.Zero() } = this
    const { x, y } = angleCenter
    angle += angleIncr

    ctx.resetTransform()

    if (angle) {
      ctx.translate(x, y)
      ctx.rotate(angle)
      ctx.translate(-x, -y)
    }
  }
}
