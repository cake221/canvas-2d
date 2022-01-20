import { AssetType, D_ASSET_BASE, OmitType } from "../type"
import { Base } from "../base"
import { assetManage } from "./assetManage"

export abstract class Asset extends Base implements D_ASSET_BASE {
  public abstract readonly type: AssetType
  get uniqueIdent(): string {
    return assetManage.countUniqueIdent(this)
  }
  public data!: string
  public id!: number

  public abstract load(): void

  assertAssetUniq() {
    if (assetManage.assetMap.has(assetManage.countUniqueIdent(this))) {
      throw new Error("资源重复创建")
    }
  }

  public fromJSON(json: OmitType<D_ASSET_BASE>): void {
    super.fromJSON(json)
    if (this.id === undefined) this.id = Date.now()
    this.assertAssetUniq()
    assetManage.addAsset(this)
  }
}
