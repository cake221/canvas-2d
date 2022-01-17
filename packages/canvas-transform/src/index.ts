import { CanvasBase, CanvasBaseParam, Point, Box, Rotate } from "@canvas-2d/shared"

import { ControlFrame } from "./control-frame"

type BoxAttr = Pick<Box, "boxX" | "boxHeight" | "boxWidth" | "boxY">

export interface BoxElement {
  elementBox: Box
  updateElementBox(box: BoxAttr): void
  render(ctx: CanvasRenderingContext2D): void
  renderBefore?: (ctx: CanvasRenderingContext2D) => void
  rotate: Rotate
}

interface ControlELement {
  boxElement: BoxElement
  controlFrame: ControlFrame
}

interface CanvasTransformParam extends CanvasBaseParam {
  boxElement?: BoxElement
  renderCallBack?: () => void
  elementBlurCallback?: (ev: PointerEvent) => void
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

  controlElement: ControlELement | null = null

  resizeIndex = 0

  renderCallBack = () => {}

  elementBlurCallback = (ev: PointerEvent) => {}

  constructor(params: CanvasTransformParam) {
    super(params)

    const { boxElement, renderCallBack, elementBlurCallback } = params
    const { canvas } = this

    canvas.addEventListener("pointerdown", this.onPointerdown)

    canvas.addEventListener("pointermove", this.onPointermove)

    canvas.addEventListener("pointerup", this.onPointerup)

    boxElement && this.setBoxElement(boxElement)

    renderCallBack && (this.renderCallBack = renderCallBack)

    elementBlurCallback && (this.elementBlurCallback = elementBlurCallback)
  }

  destroy() {
    const { canvas } = this
    canvas.removeEventListener("pointerdown", this.onPointerdown)
    canvas.removeEventListener("pointermove", this.onPointermove)
    canvas.removeEventListener("pointerup", this.onPointerup)
    this.controlElement = null
    this.clear()
  }

  setBoxElement(boxElement: BoxElement) {
    this.controlElement = {
      boxElement,
      controlFrame: new ControlFrame(boxElement.rotate)
    }

    this.init()
  }

  onPointerdown = (ev: PointerEvent) => {
    const { controlElement } = this
    if (!controlElement) return
    const {
      boxElement: { rotate }
    } = controlElement
    const p = this.dom2CanvasPoint(ev.x, ev.y)
    this.p = p
    this.pBaseTrans = p.countPointBaseRotate(rotate)
    this.firstP = p
    this.firstPBaseTrans = this.pBaseTrans
    this.countControlAction(ev)
  }

  countControlAction(ev: PointerEvent) {
    const { pBaseTrans, p, controlElement } = this
    if (!controlElement) return
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

    this.elementBlurCallback(ev)
  }

  onPointermove = (ev: PointerEvent) => {
    const { controlAction, p, pBaseTrans, controlElement } = this
    if (this.controlAction === CONTROL_ACTION.None || !controlElement) return
    const { controlFrame, boxElement } = controlElement
    const { rotate, elementBox } = boxElement
    const { boxX, boxY, boxWidth, boxHeight } = elementBox

    const nextPoint = this.dom2CanvasPoint(ev.x, ev.y)
    const nextPointOnTrans = nextPoint.countPointBaseRotate(rotate)
    const xGap = nextPointOnTrans.x - pBaseTrans.x
    const yGap = nextPointOnTrans.y - pBaseTrans.y
    if (controlAction === CONTROL_ACTION.Drag) {
      boxElement.updateElementBox({
        ...elementBox,
        boxX: boxX + xGap,
        boxY: boxY + yGap
      })
    } else if (controlAction === CONTROL_ACTION.Rotate) {
      rotate.angle += controlFrame.countRotateAngle(p, nextPoint)
    } else if (controlAction === CONTROL_ACTION.Resize) {
      const { resizeIndex } = this
      let newBox: any = {}
      if (resizeIndex % 3 === 0) {
        newBox = {
          ...newBox,
          boxHeight: boxHeight - yGap,
          boxY: boxY + yGap
        }
      } else if (resizeIndex % 3 === 2) {
        newBox = { ...newBox, boxHeight: boxHeight + yGap }
      }

      if (Math.floor(resizeIndex / 3) === 0) {
        newBox = { ...newBox, boxX: boxX + xGap, boxWidth: boxWidth - xGap }
      } else if (Math.floor(resizeIndex / 3) === 2) {
        newBox = { ...newBox, boxWidth: boxWidth + xGap }
      }
      if (
        (newBox.boxWidth === undefined || newBox.boxWidth > 0) &&
        (newBox.boxHeight === undefined || newBox.boxHeight > 0)
      ) {
        boxElement.updateElementBox({ ...elementBox, ...newBox })
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
    if (!controlElement) return
    const { boxElement, controlFrame } = controlElement
    ctx.save()
    this.clear()
    boxElement.render(ctx)
    boxElement.renderBefore && boxElement.renderBefore(ctx)
    controlFrame.render(ctx, boxElement.elementBox)
    ctx.restore()
    this.renderCallBack()
  }
}
