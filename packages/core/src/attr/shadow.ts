import { assertJsonType } from "@canvas-2d/shared"
import { Attribute } from "../attr"
import { D_SHADOW, OmitType } from "../type"

export class Shadow extends Attribute implements D_SHADOW {
  public type: string = "attr_shadow"
  public ATTRIBUTE_NAMES: (keyof D_SHADOW)[] = [
    "shadowBlur",
    "shadowColor",
    "shadowOffsetX",
    "shadowOffsetY"
  ]

  shadowBlur: number = 0
  shadowColor: string = "#ffffff00"
  shadowOffsetX: number = 0
  shadowOffsetY: number = 0

  static assertJsonTrue(json?: OmitType<D_SHADOW>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY } = json
    assertJsonType(shadowBlur, "number")
    assertJsonType(shadowColor, "string")
    assertJsonType(shadowOffsetX, "number")
    assertJsonType(shadowOffsetY, "number")
  }

  fromJSON(json: OmitType<D_SHADOW>): void {
    super.fromJSON(json)
  }
}
