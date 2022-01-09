import { Point } from "@canvas-2d/shared"

import { D_SHAPE } from "./type"
import { Shape, Transform } from "./element"

export class Frame {
  constructor(public x = 0, public y = 0, public width = 0, public height = 0) {}

  // 边框的四个点的坐标: 左上、右上、右下、左下
  framePoints(): [Point, Point, Point, Point] {
    const { x, y, width, height } = this
    return [
      new Point(x, y),
      new Point(x + width, y),
      new Point(x + width, y + height),
      new Point(x, y + height)
    ]
  }

  isPointInFrame(point: Point, transform?: Transform) {
    const { x, y } = point
    const framePoints = this.framePoints()
    const [p1, p2, p3, p4] = transform
      ? framePoints.map((p) => transform.transformPoint(p))
      : framePoints

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

  render(
    ctx: CanvasRenderingContext2D,
    fill: string = "rgba(0, 0, 0, 0)",
    stroke: string = "rgba(0, 0, 0, 0)"
  ) {
    const { x, y, width, height } = this
    const boundingBoxData: D_SHAPE = {
      type: "shape",
      d_path: {
        type: "rect",
        x,
        y,
        width,
        height
      },
      fill,
      stroke
    }
    Shape.createObj(Shape, boundingBoxData).render(ctx)
  }
}
