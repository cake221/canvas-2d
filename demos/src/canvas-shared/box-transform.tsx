import React, { useEffect, useRef } from "react"
import { CanvasTransform } from "../transform"
import { CanvasBackGround } from "@canvas-2d/shared"

export function BoxTransform() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasBgRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    new CanvasTransform({ canvas: canvasRef.current!, width: 600, height: 600 })
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
