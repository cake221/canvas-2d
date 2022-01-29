export type Asset_ID = number
export type Asset_Data = string

export interface D_ASSET_BASE {
  data: Asset_Data
}

export interface D_ASSET_IMAGE extends D_ASSET_BASE {
  type: "asset_image"
}

export interface D_ASSET_FONT extends D_ASSET_BASE {
  type: "asset_font"
}

export type D_ASSET = D_ASSET_IMAGE | D_ASSET_FONT
export type AssetType = D_ASSET["type"]
