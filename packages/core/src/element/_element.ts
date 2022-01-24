import { Box, assertJsonType, assetValueRange } from "@canvas-2d/shared"
import { Base } from "../base"
import { Origin, Rotate, Clip, Gradient, Pattern, StrokeParam, Shadow } from "../attr"
import { D_ELEMENT_BASE, ElementType, D_PATTER, D_GRADIENT, OmitType } from "../type"

export interface RenderParam {}

export abstract class Element extends Base implements D_ELEMENT_BASE {
  public abstract readonly type: ElementType
  public abstract render(ctx: CanvasRenderingContext2D): void
  public abstract countElementBox(ctx: CanvasRenderingContext2D): void
  public abstract updateElementBox(box: Pick<Box, "boxX" | "boxHeight" | "boxWidth" | "boxY">): void

  static ELEMENT_ATTRIBUTES: (keyof D_ELEMENT_BASE)[] = [
    "fill",
    "stroke",
    "fillRule",
    "strokeParam",
    "rotate",
    "origin",
    "shadow",
    "filter",
    "clip"
  ]

  renderParam?: RenderParam

  fill: string | Gradient | Pattern = "rgba(0, 0, 0, 0)"

  stroke: string | Gradient | Pattern = "rgba(0, 0, 0, 0)"

  strokeParam: StrokeParam = new StrokeParam()

  static fillRule = ["evenodd", "nonzero"]

  fillRule: CanvasFillRule = "evenodd"

  shadow: Shadow = new Shadow()

  rotate: Rotate = new Rotate()

  coordStroke: string = ""

  filter: string = ""

  origin: Origin = new Origin()

  clip: Clip = new Clip()

  elementBox = new Box()

  visible = true

  disappear() {
    this.visible = false
  }

  appear() {
    this.visible = true
  }

  setShadow(ctx: CanvasRenderingContext2D) {
    this.shadow?.takeEffect(ctx)
  }

  setRotate(ctx: CanvasRenderingContext2D) {
    this.rotate?.takeEffect(ctx)
  }

  renderBefore(ctx: CanvasRenderingContext2D) {
    this.setRotate(ctx)
  }

  renderCoord(ctx: CanvasRenderingContext2D) {
    const { coordStroke, origin } = this
    const { x, y } = origin
    if (coordStroke) {
      ctx.beginPath()
      ctx.moveTo(x + 20, y)
      ctx.lineTo(x, y)
      ctx.lineTo(x, 20 + y)
      ctx.strokeStyle = coordStroke
      ctx.stroke()
    }
  }

  renderAfter(ctx: CanvasRenderingContext2D) {
    this.countElementBox(ctx)
    this.rotate.elementBox = this.elementBox
    this.renderCoord(ctx)
  }

  setContextParam(ctx: CanvasRenderingContext2D): void {
    this.setClip(ctx)
    this.setShadow(ctx)
    this.setFilter(ctx)
    this.setFill(ctx)
    this.setStroke(ctx)
  }

  setStroke(ctx: CanvasRenderingContext2D) {
    const { stroke, strokeParam } = this
    if (!stroke || strokeParam?.lineWidth === 0) {
      return
    }

    if (typeof stroke === "string") {
      ctx.strokeStyle = stroke
    } else if (Gradient.isGradient(stroke)) {
      ctx.strokeStyle = stroke.genGradient(ctx)
    } else if (Pattern.isPattern(stroke)) {
      ctx.strokeStyle = stroke.genPattern(ctx) || ""
    }

    this.strokeParam.takeEffect(ctx)
  }

  setFill(ctx: CanvasRenderingContext2D) {
    const { fill } = this
    if (!fill) return
    if (typeof fill === "string") {
      ctx.fillStyle = fill
    } else if (Gradient.isGradient(fill)) {
      ctx.fillStyle = fill.genGradient(ctx)
    } else if (Pattern.isPattern(fill)) {
      ctx.fillStyle = fill.genPattern(ctx) || ""
    }
  }

  setFilter(ctx: CanvasRenderingContext2D) {
    const { filter } = this
    if (filter) {
      ctx.filter = filter
    }
  }

  setClip(ctx: CanvasRenderingContext2D) {
    const { fillRule, origin } = this
    this.clip?.takeEffect(ctx, { fillRule, origin })
  }

  static assertJsonTrue(json?: OmitType<D_ELEMENT_BASE>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { strokeParam, shadow, rotate, fill, stroke, clip, origin, fillRule, filter } = json
    // "origin"
    assertJsonType(origin?.x, "number")
    assertJsonType(origin?.y, "number")

    // "fill" "stroke"

    if (!!fill && typeof fill !== "string") {
      if ((fill as D_GRADIENT).gradientShape) {
        Gradient.assertJsonTrue(fill as D_GRADIENT)
      } else if ((fill as D_PATTER).asset !== undefined) {
        Pattern.assertJsonTrue(fill as D_PATTER)
      }
    }

    if (!!stroke && typeof stroke !== "string") {
      if ((stroke as D_GRADIENT).gradientShape) {
        Gradient.assertJsonTrue(stroke as D_GRADIENT)
      } else if ((stroke as D_PATTER).asset !== undefined) {
        Pattern.assertJsonTrue(stroke as D_PATTER)
      }
    }

    // "rotate"
    Rotate.assertJsonTrue(rotate)

    // "clip"
    Clip.assertJsonTrue(clip)

    // "fillRule"
    assetValueRange(fillRule, Element.fillRule)

    // "strokeParam"
    StrokeParam.assertJsonTrue(strokeParam)

    // "shadow"
    Shadow.assertJsonTrue(shadow)

    // "filter"
    assertJsonType(filter, "string")
  }

  fromJSON(json: OmitType<D_ELEMENT_BASE>): void {
    super.fromJSON(json)
    const { strokeParam, shadow, rotate, fill, stroke, clip } = json

    json.origin && this.origin.fromJSON(json.origin)

    if (!!fill && typeof fill !== "string") {
      if (Gradient.isGradientData(fill)) {
        if (Gradient.isGradient(this.fill)) {
          this.fill.fromJSON(fill)
        } else {
          this.fill = new Gradient()
          this.fill.fromJSON(fill)
        }
      }

      if (Pattern.isPatternData(fill)) {
        if (Pattern.isPattern(this.fill)) {
          this.fill.fromJSON(fill)
        } else {
          this.fill = new Pattern()
          this.fill.fromJSON(fill)
        }
      }
    }

    if (!!stroke && typeof stroke !== "string") {
      if (Gradient.isGradientData(stroke)) {
        if (Gradient.isGradient(this.stroke)) {
          this.stroke.fromJSON(stroke)
        } else {
          this.stroke = new Gradient()
          this.stroke.fromJSON(stroke)
        }
      }

      if (Pattern.isPatternData(stroke)) {
        if (Pattern.isPattern(this.stroke)) {
          this.stroke.fromJSON(stroke)
        } else {
          this.stroke = new Pattern()
          this.stroke.fromJSON(stroke)
        }
      }
    }

    strokeParam && this.strokeParam.fromJSON(strokeParam)

    shadow && this.shadow.fromJSON(shadow)

    rotate && this.rotate.fromJSON(rotate)

    clip && this.clip.fromJSON(clip)
  }
}
