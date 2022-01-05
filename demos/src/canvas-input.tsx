import React, { useEffect, useRef, useState } from "react"
import { CanvasInput } from "@canvas-2d/canvas-input"

export default function CanvasJson() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    new CanvasInput({ canvas: canvasRef.current!, width: 600, height: 600 })
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
