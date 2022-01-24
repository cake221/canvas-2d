import { Box, assertJsonType, assetValueRange } from "@canvas-2d/shared"

import { Element } from "./_element"
import { ImageType, D_IMAGE, D_ASSET_IMAGE, OmitType } from "../type"
import { AssetImage, assetManage } from "../asset"

export class Image extends Element implements D_IMAGE {
  public readonly type: ImageType = "image"

  public ATTRIBUTE_NAMES: (keyof D_IMAGE)[] = [
    "asset",
    "width",
    "height",
    "imageSmoothing",
    "imageSmoothingQuality"
  ]

  constructor() {
    super()
    this.ATTRIBUTE_NAMES.push(...Element.ELEMENT_ATTRIBUTES)
  }

  asset!: number | D_ASSET_IMAGE

  uniqueIdent: string = ""

  width: number = 0

  height: number = 0

  imageSmoothing: boolean = true

  static imageSmoothingQuality = ["high", "low", "medium"]

  imageSmoothingQuality: ImageSmoothingQuality = "medium"

  setImageSmoothing(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = this.imageSmoothing
    ctx.imageSmoothingQuality = this.imageSmoothingQuality
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const { width, height, uniqueIdent } = this

    const asset = assetManage.getAsset(uniqueIdent) as AssetImage
    if (!asset || !asset.element) {
      throw new Error("没有图片资源填充")
    }

    if (!asset || !asset.element || !width || !height) return
    ctx.save()
    this.renderBefore(ctx)
    this.renderImage(ctx, asset)
    this.renderAfter(ctx)
    ctx.restore()
  }

  public renderBefore(ctx: CanvasRenderingContext2D): void {
    super.renderBefore(ctx)
    this.setImageSmoothing(ctx)
    this.setContextParam(ctx)
    this.setImageSmoothing(ctx)
  }

  public renderImage(ctx: CanvasRenderingContext2D, asset: AssetImage) {
    const { x, y } = this.origin
    const { width, height } = this
    ctx.drawImage(asset.element!, x, y, width, height)
  }

  public updateElementBox(box: Partial<Box>): void {
    const { boxX, boxY, boxWidth, boxHeight } = box
    const { origin } = this

    boxX && (origin.x = boxX)
    boxY && (origin.y = boxY)
    boxWidth && (this.width = boxWidth)
    boxHeight && (this.height = boxHeight)
  }

  public countElementBox(ctx: CanvasRenderingContext2D): void {
    const { elementBox, width, height, origin } = this
    elementBox.boxX = origin.x
    elementBox.boxY = origin.y
    elementBox.boxWidth = width
    elementBox.boxHeight = height
  }

  static assertJsonTrue(json?: OmitType<D_IMAGE>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { asset, width, height, imageSmoothing, imageSmoothingQuality } = json

    if (typeof asset !== "number") {
      AssetImage.assertJsonTrue(asset)
    }
    assertJsonType(width, "number")
    assertJsonType(height, "number")
    assertJsonType(imageSmoothing, "boolean")
    assetValueRange(imageSmoothingQuality, Image.imageSmoothingQuality)
  }

  fromJSON(json: OmitType<D_IMAGE>): void {
    const { asset } = json
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
  }
}
