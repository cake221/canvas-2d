import React, { useEffect, useRef } from "react"
import { CanvasBackGround, Box, RotateImp, Rotate } from "@canvas-2d/shared"
import { CanvasTransform, BoxElement } from "../../../packages/canvas-transform/src"

class Element implements BoxElement {
  constructor(public angleCenterDragEnable: boolean = false) {}
  rotate: Rotate = new RotateImp()
  elementBox: Box = new Box(0, 0, 100, 200)
  updateElementBox = (box: Pick<Box, "boxX" | "boxHeight" | "boxWidth" | "boxY">) => {
    const { boxX, boxY, boxWidth, boxHeight } = box
    const { elementBox } = this
    elementBox.boxX = boxX
    elementBox.boxY = boxY
    elementBox.boxWidth = boxWidth
    elementBox.boxHeight = boxHeight
    if (!this.angleCenterDragEnable) {
      this.rotate.angleCenter = elementBox.centerPoint
    }
  }
  render = (ctx: CanvasRenderingContext2D) => {
    const { elementBox, rotate } = this
    ctx.save()
    rotate.takeEffect(ctx)
    elementBox.render(ctx, { fill: "yellow", stroke: "red" })
    ctx.restore()
  }
}

export function BoxTransform() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const canvasBgRef = useRef<HTMLCanvasElement>(null)
  const eleRef = useRef<Element | null>(null)

  useEffect(() => {
    const angleCenterDragEnable = true
    eleRef.current = new Element(angleCenterDragEnable)
    new CanvasTransform({
      canvas: canvasRef.current!,
      width: 600,
      height: 600,
      boxElement: eleRef.current!,
      angleCenterDragEnable
    })
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
