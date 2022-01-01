import React, { useEffect, useRef, useState } from "react"
import { Shape, D_SHAPE } from "@canvas-2d/core"
import "./App.css"

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext("2d")
    if (!ctx) {
      console.error("13")
    }
    const d: D_SHAPE = {
      type: "shape",
      d_path: {
        type: "rect",
        width: 100,
        height: 100
      },
      fill: "red"
    }
    Shape.createObj(Shape, d).render(ctx)
  }, [])

  return <canvas ref={canvasRef} />
}

export default App
