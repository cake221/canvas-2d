import { Box, Point, assertJsonType } from "@canvas-2d/shared"

import { Origin } from "../attr"
import { D_PATH_POLYGON, OmitType } from "../type"
import { Path, PathParam } from "./_path"

export class Polygon extends Path implements D_PATH_POLYGON {
  readonly type = "polygon"

  ATTRIBUTE_NAMES: (keyof D_PATH_POLYGON)[] = [
    "centerX",
    "centerY",
    "radius",
    "sides",
    "startAngle"
  ]

  centerX: number = 0
  centerY: number = 0
  radius: number = 0
  sides: number = 0
  startAngle: number = 0

  genPath(ctx: CanvasRenderingContext2D, pathParam: PathParam): void {
    const points = this.getPoints(pathParam.origin)

    ctx.beginPath()

    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < this.sides; ++i) {
      ctx.lineTo(points[i].x, points[i].y)
    }

    ctx.closePath()
  }

  getPoints(origin: Origin): Point[] {
    let { startAngle, centerX, centerY, sides, radius } = this
    const points = []
    let angle = startAngle || 0
    centerX = origin.x + centerX
    centerY = origin.y + centerY

    for (let i = 0; i < sides; ++i) {
      points.push(new Point(centerX + radius * Math.sin(angle), centerX - radius * Math.cos(angle)))
      angle += (2 * Math.PI) / sides
    }

    this.pathBox = new Box(centerX - radius, centerY - radius, 2 * radius, 2 * radius)

    return points
  }

  public updatePathBox(box: Partial<Box>, pathParam: PathParam): void {
    throw new Error("Method not implemented.")
  }

  static assertJsonTrue(json?: OmitType<D_PATH_POLYGON>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { radius, startAngle, centerX, centerY, sides } = json
    assertJsonType(centerX, "number")
    assertJsonType(centerY, "number")
    assertJsonType(radius, "number")
    assertJsonType(startAngle, "number")
    assertJsonType(sides, "number")
  }

  fromJSON(json: OmitType<D_PATH_POLYGON>): void {
    super.fromJSON(json)
  }
}
