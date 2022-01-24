import { Box, assertJsonType } from "@canvas-2d/shared"
import { D_PATH_ELLIPSE, OmitType } from "../type"

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

  x: number = 0
  y: number = 0
  radiusX: number = 0
  radiusY: number = 0
  rotation: number = 0
  startAngle: number = 0
  endAngle: number = 0
  anticlockwise: boolean = true

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

    this.pathBox = new Box(x - radiusX, y - radiusY, 2 * radiusX, 2 * radiusY)

    ctx.closePath()
  }

  public updatePathBox(
    box: Pick<Box, "boxX" | "boxHeight" | "boxWidth" | "boxY">,
    pathParam: PathParam
  ): void {
    const { boxX, boxY, boxWidth, boxHeight } = box
    const { origin } = pathParam
    if (boxWidth <= 0 || boxHeight <= 0) return
    this.radiusX = boxWidth / 2
    this.radiusY = boxHeight / 2
    this.x = boxX - origin.x + this.radiusX
    this.y = boxY - origin.y + this.radiusY
  }

  static assertJsonTrue(json?: OmitType<D_PATH_ELLIPSE>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { x, y, radiusX, radiusY, startAngle, endAngle, anticlockwise, rotation } = json
    assertJsonType(x, "number")
    assertJsonType(y, "number")
    assertJsonType(radiusX, "number")
    assertJsonType(radiusY, "number")
    assertJsonType(rotation, "number")
    assertJsonType(startAngle, "number")
    assertJsonType(endAngle, "number")
    assertJsonType(anticlockwise, "boolean")
  }

  fromJSON(json: OmitType<D_PATH_ELLIPSE>): void {
    super.fromJSON(json)
  }
}
