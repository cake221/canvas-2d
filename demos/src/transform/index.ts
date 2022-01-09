import { CanvasBase, CanvasBaseParam, Point } from "@canvas-2d/shared"
import { Shape, D_SHAPE, Transform, Frame } from "@canvas-2d/core"

import { ControlFrame } from "./control-frame"

interface CanvasTransformParam extends CanvasBaseParam {}

export class CanvasTransform extends CanvasBase {
  isDrag = false

  shape!: Shape

  transform: Transform = Transform.createObj(Transform, {})

  firstPoint = new Point(0, 0)

  controlFrame = new ControlFrame(new Frame())

  constructor(params: CanvasTransformParam) {
    super(params)

    this.canvas.addEventListener("pointerdown", this.onPointerdown)

    this.canvas.addEventListener("pointermove", this.onPointermove)

    this.canvas.addEventListener("pointerup", this.onPointerup)

    this.createShape()

    if (!this.shape.transform) {
      this.shape.transform = Transform.createObj(Transform, {})
    }
  }

  onPointerdown = (ev: PointerEvent) => {
    const { ctx, controlFrame } = this
    const { boundingBox, controlPoints } = controlFrame
    const p = this.dom2CanvasPoint(ev.pageX, ev.pageY)
    this.firstPoint = p
    this.isDrag = boundingBox.isPointInFrame(p, this.shape.transform)
  }

  onPointermove = (ev: PointerEvent) => {
    if (!this.isDrag) return
    const { firstPoint, ctx } = this
    ctx.resetTransform()
    const p = this.dom2CanvasPoint(ev.pageX, ev.pageY)
    this.transform.offsetX = p.x - firstPoint.x
    this.transform.offsetY = p.y - firstPoint.y
    this.transform.takeEffect(ctx)
    this.renderElement()
  }

  onPointerup = () => {
    if (!this.isDrag) return
    const { ctx, shape, transform } = this
    ctx.resetTransform()
    shape.transform!.applyTransform(transform)
    this.transform.reset()
    this.renderElement()
    this.isDrag = false
  }

  createShape() {
    const shapeData: D_SHAPE = {
      type: "shape",
      d_path: {
        type: "rect",
        width: 100,
        height: 200,
        x: 100,
        y: 100
      },
      stroke: "red",
      fill: "yellow",
      transform: {
        offsetX: 50
      }
    }

    this.shape = Shape.createObj(Shape, shapeData)
    this.renderElement()
  }

  renderElement() {
    const { ctx } = this
    this.clear()
    this.shape?.render(ctx)
    this.controlFrame.render(ctx, this.shape.elementFrame)
  }
}
