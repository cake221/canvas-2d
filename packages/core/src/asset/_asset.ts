import { AssetType, D_ASSET_BASE } from "../type"
import { Base } from "../base"

export interface IAsset {
  asset: Asset
  load(): Promise<void>
}

export abstract class Asset extends Base implements D_ASSET_BASE {
  public abstract readonly type: AssetType
  public uniqueIdent: string = ""
  public data!: string
  public id!: number

  public abstract load(): void

  static assetMap: Map<string, Asset> = new Map()

  static getUniqueIdent(type: AssetType, id: number) {
    return `__${type}__${id}`
  }

  static getAsset(uniqueIdent: string): Asset | null {
    return Asset.assetMap.get(uniqueIdent) ?? null
  }

  static setAsset(uniqueIdent: string, ele: Asset) {
    Asset.assetMap.set(uniqueIdent, ele)
  }

  assertAssetUniq() {
    const { type, id } = this
    if (Asset.assetMap.has(Asset.getUniqueIdent(type, id))) {
      throw new Error("资源重复创建")
    }
  }

  public fromJSON(json: D_ASSET_BASE): void {
    super.fromJSON(json)
    if (this.id === undefined) this.id = Date.now()
    this.assertAssetUniq()
  }
}
