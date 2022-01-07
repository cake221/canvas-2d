import React, { useEffect, useRef } from "react"
import { CanvasTransform } from "@canvas-2d/canvas-transform"

export default function CanvasJson() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    new CanvasTransform({ canvas: canvasRef.current!, width: 600, height: 600 })
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: "600px",
        height: "600px",
        border: "1px solid red"
      }}
    />
  )
}
