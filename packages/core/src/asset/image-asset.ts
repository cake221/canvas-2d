import { onImageLoad } from "@canvas-2d/shared"
import { D_ASSET_IMAGE, OmitType } from "../type"
import { Asset } from "./_asset"
import { assetManage } from "./assetManage"

export class AssetImage extends Asset implements D_ASSET_IMAGE {
  public readonly type = "asset_image"

  ATTRIBUTE_NAMES: (keyof D_ASSET_IMAGE)[] = [...this.ASSET_ATTRIBUTE]

  public element: HTMLImageElement | null = null

  public async load(): Promise<void> {
    const { data } = this
    if (this.element) return
    const img = await new Promise<HTMLImageElement>((resolve, reject) =>
      onImageLoad(data, resolve, reject)
    )
    this.element = img
  }

  static assertJsonTrue(json?: OmitType<D_ASSET_IMAGE>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
  }

  fromJSON(json: OmitType<D_ASSET_IMAGE>): void {
    const { allAsset } = assetManage
    for (const asset of allAsset) {
      if (asset.data === json.data) {
        this.id = asset.id
        return
      }
    }
    super.fromJSON(json)
  }
}
