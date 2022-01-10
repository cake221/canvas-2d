import { Point } from "@canvas-2d/shared"

import { Attribute } from "./_attr"
import { D_ORIGIN } from "../type"

export class Origin extends Attribute implements D_ORIGIN {
  public type: string = "attr_origin"
  public ATTRIBUTE_NAMES: (keyof D_ORIGIN)[] = ["x", "y"]

  x: number = 0
  y: number = 0

  toPoint() {
    return new Point(this.x, this.y)
  }
}
