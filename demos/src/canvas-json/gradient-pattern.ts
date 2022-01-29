import { JSON_DATA } from "@canvas-2d/canvas-json"
import { wrapStaticUrl } from "../../shared"

export const gradientPatternJson: JSON_DATA = {
  layers: [
    {
      type: "text",
      origin: {
        x: 100,
        y: 100
      },
      fill: {
        type: "attr_gradient",
        gradientShape: [0, 0, 500, 500],
        gradientColors: [
          [0, "blue"],
          [0.25, "blue"],
          [0.5, "white"],
          [0.75, "red"],
          [1.0, "yellow"]
        ]
      },
      stroke: {
        type: "attr_pattern",
        asset: {
          data: wrapStaticUrl("images/cloth.png"),
          type: "asset_image"
        },
        repetition: "repeat"
      },
      text: "你好fillStyle.genGradient(ctx)",
      font: {
        fontFamily: "sans-serif",
        fontSize: 100
      },
      strokeParam: {
        lineWidth: 10
      }
    },
    {
      type: "text",
      origin: {
        x: 100,
        y: 300
      },
      fill: {
        type: "attr_pattern",
        asset: {
          data: wrapStaticUrl("images/redball.png"),
          type: "asset_image"
        },
        repetition: "repeat"
      },
      stroke: {
        type: "attr_gradient",
        gradientShape: [100, 100, 500, 500],
        gradientColors: [
          [0, "yellow"],
          [0.25, "red"],
          [0.5, "blue"],
          [0.75, "red"],
          [1.0, "blue"]
        ]
      },
      text: "你好fillStyle.genGradient(ctx)",
      font: {
        fontFamily: "sans-serif",
        fontSize: 100
      },
      strokeParam: {
        lineWidth: 10
      }
    }
  ],
  height: 500,
  width: 500,
  dpr: 10
}
