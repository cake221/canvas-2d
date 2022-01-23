import { assertJsonType, assetValueRange } from "@canvas-2d/shared"
import { Attribute } from "./_attr"
import { D_STROKE_PARAM, OmitType } from "../type"

export class StrokeParam extends Attribute implements D_STROKE_PARAM {
  public type: string = "attr_stroke_styles"
  public ATTRIBUTE_NAMES: (keyof D_STROKE_PARAM)[] = [
    "lineDash",
    "lineDashOffset",
    "lineCap",
    "lineJoin",
    "miterLimit",
    "lineWidth"
  ]

  static lineJoin = ["bevel", "miter", "round"]
  static lineCap = ["butt", "round", "square"]

  lineWidth: number = 2
  lineDash: number[] = []
  lineDashOffset: number = 0
  lineCap: CanvasLineCap = "butt"
  lineJoin: CanvasLineJoin = "bevel"
  miterLimit: number = 0

  takeEffect(ctx: CanvasRenderingContext2D): void {
    super.takeEffect(ctx)
    if (this.lineDash !== undefined) {
      this.setLineDash(ctx, this.lineDash)
    }
  }

  setLineDash(ctx: CanvasRenderingContext2D, dashArray: number[]) {
    if (!dashArray || dashArray.length === 0) {
      return
    }
    ctx.setLineDash(dashArray)
  }

  static assertJsonTrue(json?: OmitType<D_STROKE_PARAM>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { lineDash, lineDashOffset, lineCap, lineJoin, miterLimit, lineWidth } = json
    assertJsonType(lineDash, "array")
    assertJsonType(lineDashOffset, "number")
    assetValueRange(lineCap, StrokeParam.lineCap)
    assetValueRange(lineJoin, StrokeParam.lineJoin)
    assertJsonType(miterLimit, "number")
    assertJsonType(lineWidth, "number")
  }

  fromJSON(json: OmitType<D_STROKE_PARAM>): void {
    super.fromJSON(json)
    const { lineDash } = json
    lineDash && (this.lineDash = lineDash)
  }
}
