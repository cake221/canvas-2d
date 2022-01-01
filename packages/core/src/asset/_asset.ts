import { AssetType, D_ASSET_BASE } from "../type"
import { Base } from "../base"

export abstract class Asset extends Base implements D_ASSET_BASE {
  public abstract readonly type: AssetType
  public abstract uniqueIdent: string
  public abstract data: string
  public abstract id: number

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
}
