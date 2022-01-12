import React, { useEffect, useRef } from "react"
import { CanvasBase, CanvasBaseParam, Point, Transform, Box } from "@canvas-2d/shared"
import { Slider, Row, Col } from "antd"

interface PointTransformParam extends CanvasBaseParam {}

class PointTrans extends CanvasBase {
  p = Point.Zero()

  static coordWidth = 300

  static coordHeight = 300

  static coordInterval = 30

  trans: Transform = new Transform()

  constructor(params: PointTransformParam) {
    super(params)
    this.canvas.addEventListener("pointerdown", this.onPointerdown)
    this.trans.offsetX = PointTrans.coordWidth
    this.trans.offsetY = PointTrans.coordHeight
  }

  onPointerdown = (ev: PointerEvent) => {
    const _p = this.dom2CanvasPoint(ev.x, ev.y)
    this.p = new Point(_p.x, _p.y)
    console.log("未转换前", this.p)
    this.render()
  }

  render() {
    const { ctx } = this
    this.clear()
    ctx.save()
    this.setTransform()
    this.renderTransPoint()
    this.renderCoord()
    ctx.restore()
  }

  setTransform() {
    this.trans.takeEffect(this.ctx)
  }

  renderTransPoint() {
    const { p, ctx, trans } = this
    const pTrans = p.countPointBaseTransform(trans)
    const { scaleX, scaleY } = trans
    Box.fromPoint(pTrans).render(ctx, { fill: "red" })
    Box.fromPoint(pTrans, 5 / scaleX, 5 / scaleY).render(ctx, { fill: "black" })
    console.log("转换后", pTrans)
  }

  renderCoord() {
    const { ctx, trans } = this
    const { coordWidth, coordHeight, coordInterval } = PointTrans
    ctx.beginPath()
    ctx.strokeStyle = "red"

    ctx.moveTo(-coordWidth, 0)
    ctx.lineTo(coordWidth, 0)

    for (let i = -coordWidth + coordInterval; i < coordWidth; i += coordInterval) {
      this.drawPoint(i, 0, "blue")
      ctx.strokeText(Math.abs(i) + "", i, 10)
    }

    ctx.stroke()

    ctx.strokeStyle = "black"
    ctx.beginPath()
    ctx.moveTo(0, -coordHeight)
    ctx.lineTo(0, coordHeight)

    for (let i = -coordHeight + coordInterval; i < coordHeight; i += coordInterval) {
      this.drawPoint(0, i, "blue")
      ctx.strokeText(Math.abs(i) + "", -10, i)
    }

    ctx.stroke()

    this.drawPoint(trans.angleCenter.x, trans.angleCenter.y, "green")
  }
}

const CanvasStyle: React.HTMLAttributes<HTMLElement>["style"] = {
  width: "600px",
  height: "600px",
  position: "absolute"
}

export default function CanvasJson() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointTransRef = useRef<PointTrans | null>(null)

  useEffect(() => {
    pointTransRef.current = new PointTrans({ canvas: canvasRef.current!, width: 600, height: 600 })
  }, [])

  // @ts-ignore
  const onChange = function(value: any, key) {
    const pointTrans = pointTransRef.current!
    if (key === "angleCenterX") {
      pointTrans.trans.angleCenter.x = value
    } else if (key === "angleCenterY") {
      pointTrans.trans.angleCenter.y = value
    } else {
      // @ts-ignore
      pointTrans.trans[key] = value
    }
    pointTransRef.current?.render()
  }

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        flexDirection: "column"
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          ...CanvasStyle,
          ...{
            outline: "1px solid red",
            position: "relative"
          }
        }}
      />

      <div
        style={{
          width: "90%"
        }}
      >
        <Row>
          <Col span={4}>offset：</Col>
          <Col span={10}>
            <Slider
              defaultValue={PointTrans.coordWidth}
              min={0}
              max={2 * PointTrans.coordWidth}
              onChange={(value) => onChange(value, "offsetX")}
            />
          </Col>
          <Col span={10}>
            <Slider
              defaultValue={PointTrans.coordHeight}
              min={0}
              max={2 * PointTrans.coordHeight}
              onChange={(value) => onChange(value, "offsetY")}
            />
          </Col>
        </Row>

        <Row>
          <Col span={4}>angle：</Col>
          <Col span={10}>
            <Slider
              defaultValue={0}
              min={0}
              step={0.1}
              max={3.3}
              onChange={(value) => onChange(value, "angle")}
            />
          </Col>
        </Row>
        <Row>
          <Col span={4}>angleCenter：</Col>
          <Col span={10}>
            <Slider
              defaultValue={0}
              min={-PointTrans.coordWidth}
              max={PointTrans.coordWidth}
              onChange={(value) => onChange(value, "angleCenterX")}
            />
          </Col>
          <Col span={10}>
            <Slider
              defaultValue={0}
              min={-PointTrans.coordHeight}
              max={PointTrans.coordHeight}
              onChange={(value) => onChange(value, "angleCenterY")}
            />
          </Col>
        </Row>

        <Row>
          <Col span={4}>scale：</Col>
          <Col span={10}>
            <Slider
              defaultValue={1}
              min={0}
              step={0.1}
              max={3}
              onChange={(value) => onChange(value, "scaleX")}
            />
          </Col>
          <Col span={10}>
            <Slider
              defaultValue={1}
              min={0}
              step={0.1}
              max={3}
              onChange={(value) => onChange(value, "scaleY")}
            />
          </Col>
        </Row>
      </div>
    </div>
  )
}
