export type Asset_ID = number

export interface D_ASSET_BASE {
  data: string
  id?: Asset_ID
}

export interface D_ASSET_IMAGE extends D_ASSET_BASE {
  type: "asset_image"
}

export type D_ASSET_FONT = {
  type: "asset_font"
}

export type D_ASSET = D_ASSET_IMAGE | D_ASSET_FONT
export type AssetType = D_ASSET["type"]
