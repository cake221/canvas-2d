import { onImageLoad } from "@canvas-2d/shared"
import { D_ASSET_IMAGE } from "../type"
import { Asset } from "./_asset"

export class AssetImage extends Asset implements D_ASSET_IMAGE {
  public readonly type = "asset_image"

  public uniqueIdent: string = ""

  ATTRIBUTE_NAMES: (keyof D_ASSET_IMAGE)[] = ["data", "id"]

  public data!: string

  public id!: number

  public height?: number

  public width?: number

  public element: HTMLImageElement | null = null

  public load(): Promise<any> {
    const { data, id, type } = this
    return new Promise<HTMLImageElement>((resolve, reject) =>
      onImageLoad(data, resolve, reject)
    ).then((img) => {
      this.element = img
      this.uniqueIdent = Asset.getUniqueIdent(type, id)
      Asset.setAsset(this.uniqueIdent, this)
    })
  }
}
