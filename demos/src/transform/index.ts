import { CanvasBase, CanvasBaseParam, Point } from "@canvas-2d/shared"
import { Shape, D_SHAPE, Frame, Element, Rotate } from "@canvas-2d/core"

import { ControlFrame } from "./control-frame"

interface CanvasTransformParam extends CanvasBaseParam {}

enum CONTROL_ACTION {
  None,
  Drag,
  Rotate,
  Resize
}

export class CanvasTransform extends CanvasBase {
  controlAction = CONTROL_ACTION.None

  element!: Element

  lastPoint = new Point(0, 0)

  lastPointOnTrans = new Point(0, 0)

  controlFrame = new ControlFrame(new Frame())

  resizeIndex = 0

  constructor(params: CanvasTransformParam) {
    super(params)

    this.canvas.addEventListener("pointerdown", this.onPointerdown)

    this.canvas.addEventListener("pointermove", this.onPointermove)

    this.canvas.addEventListener("pointerup", this.onPointerup)

    this.createShape()
  }

  onPointerdown = (ev: PointerEvent) => {
    const { element } = this
    const p = this.dom2CanvasPoint(ev.x, ev.y)
    this.lastPoint = p
    this.lastPointOnTrans = p.countEndPointByRotate(
      element.rotate?.angleCenter,
      -element.rotate?.angle!
    )
    this.countControlAction()
  }

  countControlAction() {
    const { lastPointOnTrans, controlFrame } = this
    const { boundingBox, rotateControl, controlPoints } = controlFrame

    if (rotateControl.isPointInFrame(lastPointOnTrans)) {
      this.controlAction = CONTROL_ACTION.Rotate
      return
    }

    for (let i = 0; i < controlPoints.length; i++) {
      if (controlPoints[i].isPointInFrame(lastPointOnTrans)) {
        this.controlAction = CONTROL_ACTION.Resize
        this.resizeIndex = i
        return
      }
    }

    if (boundingBox.isPointInFrame(lastPointOnTrans)) {
      this.controlAction = CONTROL_ACTION.Drag
      return
    }
  }

  onPointermove = (ev: PointerEvent) => {
    const { controlAction, lastPoint, lastPointOnTrans, element } = this
    if (controlAction === CONTROL_ACTION.None) return
    const p = this.dom2CanvasPoint(ev.x, ev.y)
    const pOnTrans = p.countEndPointByRotate(element.rotate?.angleCenter, -element.rotate?.angle!)
    const xGap = pOnTrans.x - lastPointOnTrans.x
    const yGap = pOnTrans.y - lastPointOnTrans.y
    if (controlAction === CONTROL_ACTION.Drag) {
      element.origin.x += xGap
      element.origin.y += yGap
    } else if (controlAction === CONTROL_ACTION.Rotate) {
      // 角度计算的值不对
      element.rotate!.angle! += this.controlFrame.countRotateAngle(lastPoint, p)
    } else if (controlAction === CONTROL_ACTION.Resize) {
      if (this.resizeIndex === 0) {
        element.origin.x += xGap
        element.origin.y += yGap
        // @ts-ignore
        ;(element as Shape).path!.width -= xGap

        // @ts-ignore
        ;(element as Shape).path!.height -= yGap
      }
    }
    this.renderElement()
    this.lastPoint = p
    this.lastPointOnTrans = pOnTrans
  }

  onPointerup = () => {
    if (this.controlAction === CONTROL_ACTION.None) return
    this.renderElement()
    this.controlAction = CONTROL_ACTION.None
  }

  createShape() {
    const shapeData: D_SHAPE = {
      type: "shape",
      d_path: {
        type: "rect",
        width: 100,
        height: 200,
        x: 0,
        y: 0
      },
      origin: {
        x: 200,
        y: 100
      },
      stroke: "red",
      fill: "yellow"
    }

    this.element = Shape.createObj(Shape, shapeData)
    this.element.coordStroke = "black"
    if (!this.element.rotate) {
      this.element.rotate = new Rotate()
      this.element.rotate.angle = 0
    }
    this.renderElement()
  }

  renderElement() {
    const { ctx, element } = this
    ctx.save()
    this.clear()

    this.element?.render(ctx)
    this.controlFrame.render(ctx, this.element.elementFrame)
    element.rotate?.setAngleCenter(this.controlFrame.centerPoint)
    ctx.restore()
  }
}
