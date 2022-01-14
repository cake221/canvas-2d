import { Box } from "@canvas-2d/shared"
import { D_PATH_RECTANGLE } from "../type"
import { Path, PathParam } from "./_path"

export class Rect extends Path implements D_PATH_RECTANGLE {
  /**
   * Type of an object
   */
  public readonly type = "rect"

  ATTRIBUTE_NAMES: (keyof D_PATH_RECTANGLE)[] = ["rx", "ry", "width", "height", "x", "y"]

  /**
   * Horizontal border radius
   */
  rx = 0

  /**
   * Vertical border radius
   */
  ry = 0

  width = 0

  height = 0

  x = 0
  y = 0

  genPath(ctx: CanvasRenderingContext2D, pathParam: PathParam): void {
    const rx = this.rx ? Math.min(this.rx, this.width / 2) : 0,
      ry = this.ry ? Math.min(this.ry, this.height / 2) : 0
    let { width: w, height: h, x, y } = this
    const { origin } = pathParam
    x += origin.x
    y += origin.y
    const isRounded = rx !== 0 || ry !== 0,
      /* "magic number" for bezier approximations of arcs (http://itc.ktu.lt/itc354/Riskus354.pdf) */
      k = 1 - 0.5522847498
    ctx.beginPath()

    ctx.moveTo(x + rx, y)

    ctx.lineTo(x + w - rx, y)
    isRounded && ctx.bezierCurveTo(x + w - k * rx, y, x + w, y + k * ry, x + w, y + ry)

    ctx.lineTo(x + w, y + h - ry)
    isRounded && ctx.bezierCurveTo(x + w, y + h - k * ry, x + w - k * rx, y + h, x + w - rx, y + h)

    ctx.lineTo(x + rx, y + h)
    isRounded && ctx.bezierCurveTo(x + k * rx, y + h, x, y + h - k * ry, x, y + h - ry)

    ctx.lineTo(x, y + ry)
    isRounded && ctx.bezierCurveTo(x, y + k * ry, x + k * rx, y, x + rx, y)

    this.pathBox = new Box(x, y, w, h)

    ctx.closePath()
  }

  public updatePathBox(box: Partial<Box>, pathParam: PathParam): void {
    const { boxX, boxY, boxWidth, boxHeight } = box
    const { origin } = pathParam
    boxX && (this.x = boxX - origin.x)
    boxY && (this.y = boxY - origin.y)
    boxWidth && (this.width = boxWidth)
    boxHeight && (this.height = boxHeight)
  }
}
