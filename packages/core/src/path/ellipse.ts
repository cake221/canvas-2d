import { Box } from "@canvas-2d/shared"
import { D_PATH_ELLIPSE } from "../type"

import { Path, PathParam } from "./_path"

export class Ellipse extends Path implements D_PATH_ELLIPSE {
  /**
   * Type of an object
   */
  public readonly type = "ellipse"

  ATTRIBUTE_NAMES: (keyof D_PATH_ELLIPSE)[] = [
    "x",
    "y",
    "radiusX",
    "radiusY",
    "rotation",
    "startAngle",
    "endAngle",
    "anticlockwise"
  ]

  x?: number
  y?: number
  radiusX!: number
  radiusY!: number
  rotation?: number
  startAngle?: number
  endAngle?: number
  anticlockwise?: boolean

  genPath(ctx: CanvasRenderingContext2D, pathParam: PathParam): void {
    let { x = 0, y = 0, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise } = this
    const { origin } = pathParam
    ctx.beginPath()

    rotation = rotation ? rotation : 0
    startAngle = startAngle ? startAngle : 0
    endAngle = endAngle ? endAngle : 2 * Math.PI
    x += origin.x
    y += origin.y

    ctx.ellipse(x, y, radiusX, radiusY, rotation, startAngle, endAngle, anticlockwise)

    this.path_Frame = new Box(x - radiusX, y - radiusY, x + radiusX, y + radiusY)

    ctx.closePath()
  }
}
