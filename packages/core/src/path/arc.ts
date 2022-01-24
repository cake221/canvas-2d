import { Box, assertJsonType } from "@canvas-2d/shared"

import { D_PATH_ARC, OmitType } from "../type"

import { Path, PathParam } from "./_path"

export class Arc extends Path implements D_PATH_ARC {
  /**
   * Type of an object
   */
  public readonly type = "arc"

  ATTRIBUTE_NAMES: (keyof D_PATH_ARC)[] = [
    "x",
    "y",
    "radius",
    "startAngle",
    "endAngle",
    "anticlockwise"
  ]

  x: number = 0

  y: number = 0

  radius: number = 0

  startAngle: number = 0

  endAngle: number = 0

  anticlockwise: boolean = true

  genPath(ctx: CanvasRenderingContext2D, pathParam: PathParam): void {
    let { x = 0, y = 0, radius, startAngle, endAngle, anticlockwise } = this
    const { origin } = pathParam
    ctx.beginPath()
    startAngle = startAngle ? startAngle : 0
    endAngle = endAngle ? endAngle : 2 * Math.PI
    x = x + origin.x
    y = y + origin.y
    ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise)
    this.pathBox = new Box(x - radius, y - radius, x + radius, y + radius)
    ctx.closePath()
  }

  public updatePathBox(box: Partial<Box>, pathParam: PathParam): void {
    throw new Error("Method not implemented.")
  }

  static assertJsonTrue(json?: OmitType<D_PATH_ARC>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { x, y, radius, startAngle, endAngle, anticlockwise } = json
    assertJsonType(x, "number")
    assertJsonType(y, "number")
    assertJsonType(radius, "number")
    assertJsonType(startAngle, "number")
    assertJsonType(endAngle, "number")
    assertJsonType(anticlockwise, "boolean")
  }

  fromJSON(json: OmitType<D_PATH_ARC>): void {
    super.fromJSON(json)
  }
}
