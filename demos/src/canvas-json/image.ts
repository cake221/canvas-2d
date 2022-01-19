import { JSON_DATA } from "@canvas-2d/canvas-json"
import { wrapStaticUrl } from "../../shared"

export const imageJson: JSON_DATA = {
  assets: [
    {
      type: "asset_image",
      data: wrapStaticUrl("images/logo.png"),
      id: 4
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
      height: 200,
      fill: "yellow",
      stroke: "red",
      d_asset: 4
    }
  ],
  dpr: 3,
  height: 500,
  width: 500
}
