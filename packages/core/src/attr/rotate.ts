import { Point, Rotate as RotateType } from "@canvas-2d/shared"

import { Attribute } from "./_attr"
import { D_ROTATE } from "../type"

export class Rotate extends Attribute implements D_ROTATE, RotateType {
  public type: string = "attr_rotate"

  public ATTRIBUTE_NAMES: (keyof D_ROTATE)[] = ["angleCenterX", "angleCenterY", "angle"]

  angle: number = 0
  angleCenter: Point = Point.Zero()

  setAngleCenter(p: Point) {
    this.angleCenter = p.clone()
  }

  // 一个元素，只能有一次变换
  takeEffect(ctx: CanvasRenderingContext2D): void {
    const { angle = 0, angleCenter = Point.Zero() } = this
    const { x, y } = angleCenter
    ctx.resetTransform()

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
