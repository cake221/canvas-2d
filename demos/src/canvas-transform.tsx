import React, { useEffect, useRef } from "react"
import { CanvasBackGround } from "@canvas-2d/shared"
import { Shape, D_SHAPE } from "@canvas-2d/core"

import { CanvasTransform } from "./transform"

const d_shape: D_SHAPE = {
  type: "shape",
  d_path: {
    type: "rect",
    width: 100,
    height: 200
  },
  fill: "yellow",
  stroke: "red"
}

const shape = Shape.createObj(Shape, d_shape)

export default function CanvasJson() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasBgRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    new CanvasTransform({ canvas: canvasRef.current!, width: 600, height: 600, boxElement: shape })
    new CanvasBackGround({
      canvas: canvasBgRef.current!,
      width: 600,
      height: 600,
      coordInterval: 20,
      backgroundColor: "white"
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
