import { assertJsonType } from "@canvas-2d/shared"
import { AssetType, D_ASSET_BASE, OmitType } from "../type"
import { Base } from "../base"
import { assetManage } from "./assetManage"

export abstract class Asset extends Base implements D_ASSET_BASE {
  public abstract readonly type: AssetType
  get uniqueIdent(): string {
    return assetManage.countUniqueIdent(this)
  }

  ASSET_ATTRIBUTE: (keyof D_ASSET_BASE)[] = ["data", "id"]

  public data: string = ""
  public id: number = Date.now()

  public abstract load(): void

  assertAssetUniq() {
    if (assetManage.assetMap.has(assetManage.countUniqueIdent(this))) {
      throw new Error("资源重复创建")
    }
  }

  static assertJsonTrue(json?: OmitType<D_ASSET_BASE>) {
    if (json === undefined) return
    const { data, id } = json
    super.assertJsonTrue(json)
    assertJsonType(data, "string")
    assertJsonType(id, "number")
  }

  public fromJSON(json: OmitType<D_ASSET_BASE>): void {
    super.fromJSON(json)
    this.assertAssetUniq()
    assetManage.addAsset(this)
  }
}
