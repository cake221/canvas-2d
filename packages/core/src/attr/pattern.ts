import { assertJsonType } from "@canvas-2d/shared"
import { Attribute } from "./_attr"
import { D_PATTER, OmitType, PatternRepetition } from "../type"
import { assetManage, AssetImage } from "../asset"

export class Pattern extends Attribute implements D_PATTER {
  public type: D_PATTER["type"] = "attr_pattern"
  public ATTRIBUTE_NAMES: (keyof D_PATTER)[] = ["asset", "repetition", "transform"]

  static repetition: PatternRepetition[] = ["repeat", "repeat-x", "repeat-y", "no-repeat"]

  repetition: PatternRepetition = "repeat"

  transform: DOMMatrix2DInit = {}

  asset!: AssetImage

  genPattern(ctx: CanvasRenderingContext2D) {
    const { repetition, transform, asset } = this
    if (!asset || !asset.element) {
      throw new Error("没有图片资源填充")
    }
    const pattern = ctx.createPattern(asset.element, repetition ?? null)
    pattern?.setTransform(transform)
    return pattern
  }

  static isPattern(obj: any): obj is Pattern {
    return obj.type === "attr_pattern"
  }

  static isPatternData(obj: any): obj is D_PATTER {
    return obj.type === "attr_pattern"
  }

  static assertJsonTrue(json?: OmitType<D_PATTER>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { asset, repetition, transform } = json
    AssetImage.assertJsonTrue(asset)
    assertJsonType(repetition, "string")
    assertJsonType(transform, "array")
  }

  fromJSON(json: OmitType<D_PATTER>): void {
    const { asset, transform } = json
    super.fromJSON(json)
    if (asset !== undefined) {
      this.asset = assetManage.getAsset(asset) as AssetImage
    }
    transform && (this.transform = transform)
  }
}
