import { assertNever } from "@canvas-2d/shared"
import { Asset, AssetImage } from "."
import { D_ASSET } from "../type"

export async function genAsset(asset: D_ASSET) {
  switch (asset.type) {
    case "asset_image":
      return Asset.createObj(AssetImage, asset).load()
    case "asset_font":
      return Promise.resolve()
    default:
      assertNever(asset)
  }
}

export * from "./_asset"
export * from "./image-asset"
