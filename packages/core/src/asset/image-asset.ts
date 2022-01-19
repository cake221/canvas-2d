import { onImageLoad } from "@canvas-2d/shared"
import { D_ASSET_IMAGE, OmitType } from "../type"
import { Asset } from "./_asset"

export class AssetImage extends Asset implements D_ASSET_IMAGE {
  public readonly type = "asset_image"

  ATTRIBUTE_NAMES: (keyof D_ASSET_IMAGE)[] = ["data", "id"]

  public height?: number

  public width?: number

  public element: HTMLImageElement | null = null

  public async load(): Promise<void> {
    const { data, id, type } = this
    this.uniqueIdent = Asset.getUniqueIdent(type, id)
    const img = await new Promise<HTMLImageElement>((resolve, reject) =>
      onImageLoad(data, resolve, reject)
    )
    this.element = img
    Asset.setAsset(this.uniqueIdent, this)
  }

  fromJSON(json: OmitType<D_ASSET_IMAGE>): void {
    super.fromJSON(json)
  }
}
