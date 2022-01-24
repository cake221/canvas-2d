import { Point, assertJsonType } from "@canvas-2d/shared"

import { Attribute } from "./_attr"
import { D_ORIGIN, OmitType } from "../type"

export class Origin extends Attribute implements D_ORIGIN {
  public type: string = "attr_origin"
  public ATTRIBUTE_NAMES: (keyof D_ORIGIN)[] = ["x", "y"]

  x: number = 0
  y: number = 0

  toPoint() {
    return new Point(this.x, this.y)
  }

  static assertJsonTrue(json?: OmitType<D_ORIGIN>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { x, y } = json
    assertJsonType(x, "number")
    assertJsonType(y, "number")
  }

  fromJSON(json: OmitType<D_ORIGIN>): void {
    super.fromJSON(json)
  }
}
