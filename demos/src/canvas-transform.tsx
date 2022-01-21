import React, { useEffect, useRef } from "react"
import { CanvasBackGround } from "@canvas-2d/shared"
import { Shape, D_SHAPE, D_IMAGE, Image, assetManage } from "@canvas-2d/core"
import { CanvasTransform } from "../../packages/canvas-transform/src"
import { wrapStaticUrl } from "../shared"

const d_shape: D_SHAPE = {
  type: "shape",
  // d_path: {
  //   type: "rect",
  //   width: 100,
  //   height: 200
  // },
  d_path: {
    type: "ellipse",
    x: 60,
    y: 60,
    radiusX: 40,
    radiusY: 30,
    startAngle: 1
  },
  origin: {
    x: 300,
    y: 300
  },
  fill: "yellow"
}

const shape = Shape.createObj(Shape, d_shape) as Shape

const imageData: D_IMAGE = {
  type: "image",
  asset: {
    type: "asset_image",
    data: wrapStaticUrl("images/logo.png"),
    id: 1
  },
  width: 200,
  height: 200
}

const image = Image.createObj(Image, imageData) as Image

export default function CanvasJson() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasBgRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    assetManage.loadAllAsset().then(() => {
      new CanvasTransform({
        canvas: canvasRef.current!,
        width: 600,
        height: 600,
        boxElement: image
      })
      new CanvasBackGround({
        canvas: canvasBgRef.current!,
        width: 600,
        height: 600,
        coordInterval: 20,
        backgroundColor: "white"
      })
    })
  }, [])

  return (
    <>
      <canvas
        ref={canvasBgRef}
        style={{
          width: "600px",
          height: "600px",
          border: "1px solid red",
          position: "absolute"
        }}
      />
      <canvas
        ref={canvasRef}
        style={{
          width: "600px",
          height: "600px",
          border: "1px solid red",
          position: "absolute"
        }}
      />
    </>
  )
}
