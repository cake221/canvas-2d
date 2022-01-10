import { Point } from "@canvas-2d/shared"

import { Origin } from "../attr"
import { D_PATH_POLYGON } from "../type"
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

  centerX!: number
  centerY!: number
  radius!: number
  sides!: number
  startAngle?: number

  genPath(ctx: CanvasRenderingContext2D, pathParam: PathParam): void {
    const points = this.getPoints(pathParam.origin)

    ctx.beginPath()

    ctx.moveTo(points[0].x, points[0].y)

    for (let i = 1; i < this.sides; ++i) {
      ctx.lineTo(points[i].x, points[i].y)
    }

    // TODO: 计算 path_Frame

    ctx.closePath()
  }

  getPoints(origin: Origin): Point[] {
    let { startAngle, centerX, centerY } = this
    const points = []
    let angle = startAngle || 0
    centerX = origin.x + centerX
    centerY = origin.y + centerY

    for (let i = 0; i < this.sides; ++i) {
      points.push(
        new Point(centerX + this.radius * Math.sin(angle), centerX - this.radius * Math.cos(angle))
      )
      angle += (2 * Math.PI) / this.sides
    }
    return points
  }
}
