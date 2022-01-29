import { Asset } from "./_asset"
import { D_ASSET, Asset_Data } from "../type"
import { genAsset } from "."

class AssetManage {
  private static _instance: AssetManage

  get allAsset() {
    const allAsset = []
    for (const asset of this.assetMap.values()) {
      allAsset.push(asset)
    }
    return allAsset
  }

  assetMap: Map<Asset_Data, Asset> = new Map()

  getAsset(d_asset: D_ASSET): Asset {
    let asset = this.assetMap.get(d_asset.data)
    if (!asset) {
      asset = genAsset(d_asset)
    }
    return asset
  }

  addAsset(asset: Asset) {
    this.assetMap.set(asset.data, asset)
  }

  async loadAllAsset() {
    return Promise.allSettled(this.allAsset.map((asset) => asset.load()))
  }

  public static getInstance() {
    if (!AssetManage._instance) {
      AssetManage._instance = new AssetManage()
    }

    return AssetManage._instance
  }
}

export const assetManage = AssetManage.getInstance() // do some thing with the _instance
