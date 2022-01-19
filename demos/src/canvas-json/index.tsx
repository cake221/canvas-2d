import React, { useEffect, useRef } from "react"
import { loadJson } from "@canvas-2d/canvas-json/src"
import { assertNever } from "@canvas-2d/shared"

import { textJson } from "./text"
import { shapeJson } from "./shape"
import { imageJson } from "./image"
import { gradientPatternJson } from "./gradient-pattern"
import { clipJson } from "./clip"

export type JsonTypes = "text" | "shape" | "image" | "gradient-pattern" | "clip"

function resolveJson(subModule: JsonTypes) {
  switch (subModule) {
    case "text":
      return textJson
    case "shape":
      return shapeJson
    case "image":
      return imageJson
    case "gradient-pattern":
      return gradientPatternJson
    case "clip":
      return clipJson
    default:
      assertNever(subModule)
  }
}

interface CanvasJsonProps {
  subModule: JsonTypes
}

export default function CanvasJson(props: CanvasJsonProps) {
  const { subModule = "text" } = props
  const canvasRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    loadJson(resolveJson(subModule)).then((canvas2d) => {
      canvasRef.current!.src = canvas2d.toBase64()
    })
  }, [subModule])

  return (
    <img
      ref={canvasRef}
      style={{
        width: "600px",
        height: "600px",
        border: "1px solid red"
      }}
    />
  )
}
