import { CanvasBase, CanvasBaseParam, Point, rotatePoint, translatePoint } from "@canvas-2d/shared"
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

  controlFrame = new ControlFrame(new Frame())

  constructor(params: CanvasTransformParam) {
    super(params)

    this.canvas.addEventListener("pointerdown", this.onPointerdown)

    this.canvas.addEventListener("pointermove", this.onPointermove)

    this.canvas.addEventListener("pointerup", this.onPointerup)

    this.createShape()
  }

  onPointerdown = (ev: PointerEvent) => {
    const p = this.dom2CanvasPoint(ev.pageX, ev.pageY)
    this.lastPoint = p
    this.countControlAction()
  }

  countControlAction() {
    const { lastPoint, controlFrame, element } = this
    const { boundingBox, rotateControl } = controlFrame
    const { rotate } = element

    // 旋转后，计算的点不对
    if (rotateControl.isPointInFrame(lastPoint, rotate)) {
      this.controlAction = CONTROL_ACTION.Rotate
    }
    if (boundingBox.isPointInFrame(lastPoint, rotate)) {
      this.controlAction = CONTROL_ACTION.Drag
    }
  }

  onPointermove = (ev: PointerEvent) => {
    const { controlAction, lastPoint, element } = this
    if (controlAction === CONTROL_ACTION.None) return
    const p = this.dom2CanvasPoint(ev.pageX, ev.pageY)
    if (controlAction === CONTROL_ACTION.Drag) {
      element.origin.x += p.x - lastPoint.x
      element.origin.y += p.y - lastPoint.y
    } else if (controlAction === CONTROL_ACTION.Rotate) {
      element.rotate?.setAngleCenter(this.controlFrame.centerPoint)
      element.rotate!.angle! += this.controlFrame.countRotateAngle(lastPoint, p)
    }
    this.renderElement()
    this.lastPoint = p
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
    if (!this.element.rotate) {
      this.element.rotate = new Rotate()
      this.element.rotate.angle = 0
    }
    this.renderElement()
  }

  renderElement() {
    const { ctx } = this
    this.clear()

    this.element?.render(ctx)
    this.controlFrame.render(ctx, this.element.elementFrame)
  }
}
