import { JSON_DATA } from "@canvas-2d/canvas-json"

export const imageJson: JSON_DATA = {
  assets: [
    {
      type: "asset_image",
      data: "/images/logo.png",
      id: 0
    }
  ],
  layers: [
    {
      type: "image",
      origin: {
        x: 100,
        y: 100
      },
      width: 200,
      height: 300,
      fill: "yellow",
      stroke: "red",
      assetId: 0
    }
  ],
  dpr: 0.5,
  height: 500,
  width: 500
}
