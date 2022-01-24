import { assertJsonType, assetValueRange } from "@canvas-2d/shared"

import { D_FONT, OmitType } from "../type"
import { Attribute } from "./_attr"

export class Font extends Attribute implements D_FONT {
  public type: string = "attr_font"

  ATTRIBUTE_NAMES: (keyof D_FONT)[] = [
    "fontFamily",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontSize",
    "lineHeight"
  ]

  fontFamily: string = "sans-serif"
  fontSize: number = 40
  static fontStyle = ["normal", "italic", "oblique"]
  fontStyle: string = "normal"
  fontVariant: string = "normal"
  static fontWeight = ["normal", "bold", "lighter", "bolder"]
  fontWeight: string = "normal"
  lineHeight: number = 1.16

  /**
   * 字体样式
   *
   * font 构造规则:
   * 1. 必须包含 font-size 和 font-family
   * 2. font-family 必须最后指定
   * 3. font-style, font-variant 和 font-weight 必须在 font-size 之前
   * 4. 可以选择性包含 font-style font-variant font-weight line-height
   * 5. line-height 必须跟在 font-size 后面，由 "/" 分隔，例如 "16px/3"
   */
  genFontValue() {
    const { fontSize, fontFamily, fontStyle, fontVariant, fontWeight, lineHeight } = this
    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px${
      lineHeight ? `/${lineHeight}` : ""
    } ${fontFamily}`
  }

  static assertJsonTrue(json?: OmitType<D_FONT>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { fontFamily, fontStyle, fontVariant, fontWeight, fontSize, lineHeight } = json
    assertJsonType(fontFamily, "string")
    assertJsonType(fontSize, "number")
    assertJsonType(lineHeight, "number")
    assertJsonType(fontVariant, "string")
    assetValueRange(fontStyle, Font.fontStyle)
    assetValueRange(fontWeight, Font.fontWeight)
  }

  fromJSON(json: OmitType<D_FONT>): void {
    super.fromJSON(json)
  }
}
