import { assertNever } from "@canvas-2d/shared"
import { Asset, AssetImage } from "."
import { D_ASSET } from "../type"

export function genAsset(asset: D_ASSET) {
  switch (asset.type) {
    case "asset_image":
      new AssetImage().fromJSON(asset)
      break
    case "asset_font":
      break
    default:
      assertNever(asset)
  }
}

export * from "./_asset"
export * from "./image-asset"
export * from "./assetManage"
