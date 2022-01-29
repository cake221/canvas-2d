import { assertJsonType } from "@canvas-2d/shared"
import { AssetType, D_ASSET_BASE, OmitType } from "../type"
import { Base } from "../base"
import { assetManage } from "./assetManage"

export abstract class Asset extends Base implements D_ASSET_BASE {
  public abstract readonly type: AssetType

  ASSET_ATTRIBUTE: (keyof D_ASSET_BASE)[] = ["data"]

  public data: string = ""

  public abstract load(): void

  assertAssetUniq() {
    if (assetManage.assetMap.has(this.data)) {
      throw new Error("资源重复创建")
    }
  }

  static assertJsonTrue(json?: OmitType<D_ASSET_BASE>) {
    if (json === undefined) return
    const { data } = json
    super.assertJsonTrue(json)
    assertJsonType(data, "string")
  }

  public fromJSON(json: OmitType<D_ASSET_BASE>): void {
    super.fromJSON(json)
    this.assertAssetUniq()
    assetManage.addAsset(this)
  }
}
