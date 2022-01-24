import { assertJsonType } from "@canvas-2d/shared"
import { Attribute } from "./_attr"
import { D_PATTER, D_ASSET_IMAGE, OmitType, PatternRepetition } from "../type"
import { assetManage, AssetImage } from "../asset"

export class Pattern extends Attribute implements D_PATTER {
  public type: D_PATTER["type"] = "attr_pattern"
  public ATTRIBUTE_NAMES: (keyof D_PATTER)[] = ["asset", "repetition", "transform"]

  static repetition: PatternRepetition[] = ["repeat", "repeat-x", "repeat-y", "no-repeat"]

  repetition: PatternRepetition = "repeat"

  transform: DOMMatrix2DInit = {}

  asset!: number | D_ASSET_IMAGE

  uniqueIdent: string = ""

  genPattern(ctx: CanvasRenderingContext2D) {
    const { repetition, transform, uniqueIdent } = this
    const asset = assetManage.getAsset(uniqueIdent) as AssetImage
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
    if (typeof asset !== "number") {
      AssetImage.assertJsonTrue(asset)
    }
    assertJsonType(repetition, "string")
    assertJsonType(transform, "array")
  }

  fromJSON(json: OmitType<D_PATTER>): void {
    const { asset, transform } = json
    super.fromJSON(json)
    const assetImage = new AssetImage()
    if (asset !== undefined) {
      if (typeof asset === "number") {
        assetImage.id = asset
        this.uniqueIdent = assetImage.uniqueIdent
      } else {
        assetImage.fromJSON(asset)
        this.uniqueIdent = assetImage.uniqueIdent
      }
    }
    transform && (this.transform = transform)
  }
}
