import { CanvasBase, CanvasBaseParam, Point } from "@canvas-2d/shared"
import { Shape, D_SHAPE, Transform } from "@canvas-2d/core"

interface CanvasTransformParam extends CanvasBaseParam {}

export class CanvasTransform extends CanvasBase {
  isDrag = false

  shape!: Shape

  transform: Transform = Transform.createObj(Transform, {})

  origin = new Point(0, 0)

  constructor(params: CanvasTransformParam) {
    super(params)

    this.canvas.addEventListener("pointerdown", this.onPointerdown)

    this.canvas.addEventListener("pointermove", this.onPointermove)

    this.canvas.addEventListener("pointerup", this.onPointerup)

    this.createShape()
  }

  onPointerdown = (ev: PointerEvent) => {
    const { ctx } = this
    ctx.resetTransform()
    const p = this.dom2CanvasPoint(ev.pageX, ev.pageY)
    this.origin = p
    this.shape.setTransform(ctx)
    this.shape.path.genPath(ctx) // 生成路径
    this.isDrag = ctx.isPointInPath(p.x, p.y)
  }

  onPointermove = (ev: PointerEvent) => {
    if (!this.isDrag) return
    const { origin, ctx } = this
    ctx.resetTransform()
    const p = this.dom2CanvasPoint(ev.pageX, ev.pageY)
    this.transform.offsetX = p.x - origin.x
    this.transform.offsetY = p.y - origin.y
    this.transform.takeEffect(ctx)
    this.renderElement()
  }

  onPointerup = () => {
    if (!this.isDrag) return
    const { ctx, shape, transform } = this
    ctx.resetTransform()
    if (!shape.transform) {
      shape.transform = Transform.createObj(Transform, {})
    }
    shape.transform!.applyTransform(transform)
    this.renderElement()
    this.isDrag = false
  }

  createShape() {
    const shapeData: D_SHAPE = {
      type: "shape",
      d_path: {
        type: "rect",
        width: 100,
        height: 100,
        x: 100,
        y: 100
      },
      stroke: "red",
      fill: "yellow"
    }

    this.shape = Shape.createObj(Shape, shapeData)
    this.renderElement()
  }

  renderElement() {
    const { ctx } = this
    this.clear()
    this.shape?.render(ctx)
  }
}
