import { CanvasBase, CanvasBaseParam, Point, Box, Rotate } from "@canvas-2d/shared"

import { ControlFrame } from "./control-frame"

export interface BoxElement {
  elementBox: Box
  updateElementBox(box: Partial<Box>): void
  render(ctx: CanvasRenderingContext2D): void
  rotate: Rotate
}

interface ControlELement {
  boxElement: BoxElement
  controlFrame: ControlFrame
}

interface CanvasTransformParam extends CanvasBaseParam {
  boxElement: BoxElement
}

enum CONTROL_ACTION {
  None,
  Drag,
  angleCenterDrag,
  Rotate,
  Resize
}

export class CanvasTransform extends CanvasBase {
  controlAction = CONTROL_ACTION.None

  firstP = new Point(0, 0)

  firstPBaseTrans = new Point(0, 0)

  p = new Point(0, 0)

  pBaseTrans = new Point(0, 0)

  controlElement!: ControlELement

  resizeIndex = 0

  constructor(params: CanvasTransformParam) {
    super(params)

    const { boxElement } = params

    this.controlElement = {
      boxElement,
      controlFrame: new ControlFrame()
    }

    this.canvas.addEventListener("pointerdown", this.onPointerdown)

    this.canvas.addEventListener("pointermove", this.onPointermove)

    this.canvas.addEventListener("pointerup", this.onPointerup)

    this.init()
  }

  onPointerdown = (ev: PointerEvent) => {
    const { controlElement } = this
    const {
      boxElement: { rotate }
    } = controlElement
    const p = this.dom2CanvasPoint(ev.x, ev.y)
    this.p = p
    this.pBaseTrans = p.countPointBaseRotate(rotate)
    this.firstP = p
    this.firstPBaseTrans = this.pBaseTrans
    this.countControlAction()
  }

  countControlAction() {
    const { pBaseTrans, p, controlElement } = this
    const { controlFrame } = controlElement
    const { boundingBox, rotateControl, controlPoints, angleCenterBox } = controlFrame

    if (angleCenterBox.isPointInFrame(p)) {
      this.controlAction = CONTROL_ACTION.angleCenterDrag
      return
    }

    if (rotateControl.isPointInFrame(pBaseTrans)) {
      this.controlAction = CONTROL_ACTION.Rotate
      return
    }

    for (let i = 0; i < controlPoints.length; i++) {
      if (controlPoints[i].isPointInFrame(pBaseTrans)) {
        this.controlAction = CONTROL_ACTION.Resize
        this.resizeIndex = i
        return
      }
    }

    if (boundingBox.isPointInFrame(pBaseTrans)) {
      this.controlAction = CONTROL_ACTION.Drag
      return
    }
  }

  onPointermove = (ev: PointerEvent) => {
    const { controlAction, p, pBaseTrans, controlElement } = this
    const { controlFrame, boxElement } = controlElement
    const { rotate } = boxElement
    const { boxX, boxY, boxWidth, boxHeight } = boxElement.elementBox

    if (controlAction === CONTROL_ACTION.None) return
    const nextPoint = this.dom2CanvasPoint(ev.x, ev.y)
    const nextPointOnTrans = nextPoint.countPointBaseRotate(rotate)
    const xGap = nextPointOnTrans.x - pBaseTrans.x
    const yGap = nextPointOnTrans.y - pBaseTrans.y
    if (controlAction === CONTROL_ACTION.Drag) {
      boxElement.updateElementBox({ boxX: boxX + xGap, boxY: boxY + yGap })
    } else if (controlAction === CONTROL_ACTION.Rotate) {
      rotate.angle += controlFrame.countRotateAngle(p, nextPoint)
    } else if (controlAction === CONTROL_ACTION.Resize) {
      const { resizeIndex } = this
      if (resizeIndex % 3 === 0) {
        boxElement.updateElementBox({ boxHeight: boxHeight - yGap, boxY: boxY + yGap })
      } else if (resizeIndex % 3 === 2) {
        boxElement.updateElementBox({ boxHeight: boxHeight + yGap })
      }

      if (Math.floor(resizeIndex / 3) === 0) {
        boxElement.updateElementBox({ boxX: boxX + xGap, boxWidth: boxWidth - xGap })
      } else if (Math.floor(resizeIndex / 3) === 2) {
        boxElement.updateElementBox({ boxWidth: boxWidth + xGap })
      }
    } else if (this.controlAction === CONTROL_ACTION.angleCenterDrag) {
      controlFrame.angleCenterBox.boxX = nextPoint.x
      controlFrame.angleCenterBox.boxY = nextPoint.y

      rotate.angleCenter = controlFrame.centerPoint.countPointBaseRotate(rotate)
    }

    this.renderElement()
    this.p = nextPoint
    this.pBaseTrans = nextPointOnTrans
  }

  onPointerup = () => {
    if (this.controlAction === CONTROL_ACTION.None) return
    this.renderElement()
    this.controlAction = CONTROL_ACTION.None
  }

  init() {
    this.renderElement()
  }

  renderElement() {
    const { ctx, controlElement } = this
    const { boxElement, controlFrame } = controlElement
    ctx.save()
    this.clear()
    boxElement.render(ctx)
    controlFrame.render(ctx, boxElement.elementBox)
    ctx.restore()
  }
}
