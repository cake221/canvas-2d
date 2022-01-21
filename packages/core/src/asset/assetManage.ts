import { Asset } from "./_asset"

class AssetManage {
  private static _instance: AssetManage

  get allAsset() {
    const allAsset = []
    for (const asset of this.assetMap.values()) {
      allAsset.push(asset)
    }
    return allAsset
  }

  assetMap: Map<string, Asset> = new Map()

  countUniqueIdent(asset: Asset) {
    const { type, id } = asset
    return `__${type}__${id}`
  }

  getAsset(uniqueIdent: string): Asset | null {
    return this.assetMap.get(uniqueIdent) ?? null
  }

  addAsset(asset: Asset) {
    const uniqueIdent = this.countUniqueIdent(asset)
    this.assetMap.set(uniqueIdent, asset)
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
