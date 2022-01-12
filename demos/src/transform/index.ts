import { CanvasBase, CanvasBaseParam, Point, Box, Transform } from "@canvas-2d/shared"

import { ControlFrame } from "./control-frame"

interface CanvasTransformParam extends CanvasBaseParam {}

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

  box = new Box(50, 50, 100, 110)

  controlFrame = new ControlFrame(this.box)

  trans = new Transform()

  resizeIndex = 0

  constructor(params: CanvasTransformParam) {
    super(params)

    this.canvas.addEventListener("pointerdown", this.onPointerdown)

    this.canvas.addEventListener("pointermove", this.onPointermove)

    this.canvas.addEventListener("pointerup", this.onPointerup)

    this.init()
  }

  onPointerdown = (ev: PointerEvent) => {
    const { trans } = this
    const p = this.dom2CanvasPoint(ev.x, ev.y)
    this.p = p
    this.pBaseTrans = p.countPointBaseTransform(trans)
    this.firstP = p
    this.firstPBaseTrans = this.pBaseTrans
    this.countControlAction()
  }

  countControlAction() {
    const { pBaseTrans, controlFrame, p } = this
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
    const { controlAction, p, pBaseTrans, trans, box, controlFrame } = this

    if (controlAction === CONTROL_ACTION.None) return
    const nextPoint = this.dom2CanvasPoint(ev.x, ev.y)
    const nextPointOnTrans = nextPoint.countPointBaseTransform(trans)
    const xGap = nextPointOnTrans.x - pBaseTrans.x
    const yGap = nextPointOnTrans.y - pBaseTrans.y
    if (controlAction === CONTROL_ACTION.Drag) {
      box.boxX += xGap
      box.boxY += yGap
    } else if (controlAction === CONTROL_ACTION.Rotate) {
      trans.angle += this.controlFrame.countRotateAngle(p, nextPoint)
    } else if (controlAction === CONTROL_ACTION.Resize) {
      const { resizeIndex } = this
      if (resizeIndex % 3 === 0) {
        box.boxY += yGap
        box.boxHeight -= yGap
      } else if (resizeIndex % 3 === 2) {
        box.boxHeight += yGap
      }

      if (Math.floor(resizeIndex / 3) === 0) {
        box.boxX += xGap
        box.boxWidth -= xGap
      } else if (Math.floor(resizeIndex / 3) === 2) {
        box.boxWidth += xGap
      }
    } else if (this.controlAction === CONTROL_ACTION.angleCenterDrag) {
      controlFrame.angleCenterBox.boxX = nextPoint.x
      controlFrame.angleCenterBox.boxY = nextPoint.y

      trans.angleCenter = this.controlFrame.centerPoint.countPointBaseTransform(trans)
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
    const { ctx, box, trans } = this
    ctx.save()
    this.clear()
    trans.takeEffect(ctx)
    this.box?.render(ctx, { fill: "yellow", stroke: "red" })
    this.controlFrame.render(ctx, box)
    ctx.restore()
  }
}
