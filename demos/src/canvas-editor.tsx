import React from "react"
import { JSON_DATA, Editor } from "./editor"
import { wrapStaticUrl } from "../shared"

const data: JSON_DATA = {
  width: 600,
  height: 600,
  layers: [
    {
      type: "shape",
      d_path: {
        type: "rect",
        rx: 5,
        ry: 10,
        width: 100,
        height: 80
      },
      origin: {
        x: 300,
        y: 10
      },
      fill: "yellow",
      stroke: "red"
    },
    {
      type: "shape",
      d_path: {
        type: "ellipse",
        radiusX: 50,
        radiusY: 100
      },
      origin: {
        x: 50,
        y: 300
      },
      fill: "red"
    },
    {
      type: "paragraph",
      text: "123",
      origin: {
        x: 300,
        y: 300
      },
      fill: "black",
      width: 200,
      height: 200
    },
    {
      type: "paragraph",
      text: "456",
      font: {},
      origin: {
        x: 100,
        y: 400
      },
      fill: "black",
      width: 200,
      height: 200
    },
    {
      type: "image",
      asset: {
        type: "asset_image",
        data: wrapStaticUrl("images/logo.png")
      },
      width: 200,
      height: 200,
      fill: "#ffffff00",
      stroke: "#ffffff00"
    }
  ],
  dpr: 2
}

export default () => <Editor data={data} />
