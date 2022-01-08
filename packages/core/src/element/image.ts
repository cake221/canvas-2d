import { Element } from "./_element"
import { ImageType, D_IMAGE } from "../type"
import { AssetImage } from "../asset"

export class Image extends Element implements D_IMAGE {
  public countFrameElement(ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.")
  }
  public readonly type: ImageType = "image"

  public ATTRIBUTE_NAMES: (keyof D_IMAGE)[] = [
    "assetId",
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

  public assetId!: number

  assetImage: AssetImage | null = null

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
    const { assetImage, width, height } = this
    if (!assetImage || !width || !height) return
    this.renderBefore(ctx)
    this.setImageSmoothing(ctx)
    this.setContextParam(ctx)
    this.setImageSmoothing(ctx)
    this.renderImage(ctx)
    this.renderAfter(ctx)
  }

  public renderImage(ctx: CanvasRenderingContext2D) {
    const { x, y } = this.origin
    const { width, height } = this
    ctx.drawImage(this!.assetImage?.element!, x, y, width, height)
  }

  public fromJSON(json: D_IMAGE): void {
    const { assetId } = json
    super.fromJSON(json)
    this.assetImage = AssetImage.getAsset(
      AssetImage.getUniqueIdent("asset_image", assetId)
    ) as AssetImage
  }
}
