import { assertNever } from "@canvas-2d/shared"
import { Asset, AssetImage } from "."
import { D_ASSET } from "../type"

export function genAsset(asset: D_ASSET): Asset {
  switch (asset.type) {
    case "asset_image":
    case "asset_font": // TODO: 实现字体加载
      const assetImage = new AssetImage()
      assetImage.fromJSON(asset)
      return assetImage
    default:
      assertNever(asset)
  }
}

export * from "./_asset"
export * from "./image-asset"
export * from "./assetManage"
