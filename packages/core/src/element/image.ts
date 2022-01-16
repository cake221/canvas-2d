import { Element } from "./_element"
import { ImageType, D_IMAGE, D_ASSET_IMAGE } from "../type"
import { Asset, AssetImage, IAsset } from "../asset"
import { Box } from "@canvas-2d/shared"

export class Image extends Element implements D_IMAGE, IAsset {
  public readonly type: ImageType = "image"

  public ATTRIBUTE_NAMES: (keyof D_IMAGE)[] = [
    "d_asset",
    "width",
    "height",
    "cropX",
    "cropY",
    "imageSmoothing",
    "imageSmoothingQuality"
  ]

  constructor() {
    super()
    this.ATTRIBUTE_NAMES.push(...Element.ELEMENT_ATTRIBUTES)
  }

  d_asset!: number | D_ASSET_IMAGE

  asset!: AssetImage

  width: number = 0

  height: number = 0

  imageSmoothing: boolean = true

  imageSmoothingQuality: ImageSmoothingQuality = "medium"

  /**
   * Image crop in pixels from original image size.
   */
  cropX: number = 0

  /**
   * Image crop in pixels from original image size.
   */
  cropY: number = 0

  setImageSmoothing(ctx: CanvasRenderingContext2D) {
    ctx.imageSmoothingEnabled = this.imageSmoothing
    ctx.imageSmoothingQuality = this.imageSmoothingQuality
  }

  public render(ctx: CanvasRenderingContext2D): void {
    const { asset, width, height } = this
    if (!asset || !asset.element || !width || !height) return
    ctx.save()
    this.renderBefore(ctx)
    this.renderImage(ctx)
    this.renderAfter(ctx)
    ctx.restore()
  }

  public renderBefore(ctx: CanvasRenderingContext2D): void {
    super.renderBefore(ctx)
    this.setImageSmoothing(ctx)
    this.setContextParam(ctx)
    this.setImageSmoothing(ctx)
  }

  public renderImage(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.origin
    const { width, height, asset } = this
    if (!asset || !asset.element) {
      throw new Error("没有图片资源填充")
    }

    ctx.drawImage(asset.element!, x, y, width, height)
  }

  async load(): Promise<void> {
    const { asset } = this
    if (!asset.element) {
      await asset.load()
    }
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

  public fromJSON(json: D_IMAGE): void {
    const { d_asset } = json
    super.fromJSON(json)
    if (typeof d_asset === "number") {
      const asset = AssetImage.getAsset(
        AssetImage.getUniqueIdent("asset_image", d_asset)
      ) as AssetImage
      if (!asset) {
        throw new Error("没有创建资源")
      }
      this.asset = asset
    } else {
      this.asset = AssetImage.createObj(AssetImage, d_asset)
    }
  }
}
