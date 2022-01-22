import { Box, assertJsonType, assetValueRange } from "@canvas-2d/shared"
import { Base } from "../base"
import { Attribute, Origin, Rotate, Clip } from "../attr"
import {
  D_ELEMENT_BASE,
  ElementType,
  D_SHADOW,
  D_PATTER,
  D_STROKE_PARAM,
  D_GRADIENT,
  D_ASSET_IMAGE,
  OmitType,
  DATA
} from "../type"
import { assetManage, AssetImage } from "../asset"

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
    } else if (stroke instanceof Gradient) {
      ctx.strokeStyle = stroke.genGradient(ctx)
    } else if (stroke instanceof Pattern) {
      ctx.strokeStyle = stroke.genPattern(ctx) || ""
    }

    this.strokeParam?.takeEffect(ctx)
  }

  setFill(ctx: CanvasRenderingContext2D) {
    const { fill } = this
    if (!fill) return
    if (typeof fill === "string") {
      ctx.fillStyle = fill
    } else if (fill instanceof Gradient) {
      ctx.fillStyle = fill.genGradient(ctx)
    } else if (fill instanceof Pattern) {
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

    // FIXME: 判断 fill 的类型
    if (!!fill && typeof fill !== "string") {
      if ((fill as D_GRADIENT).gradientShape) {
        this.fill = Gradient.createObj(Gradient, fill)
      } else if ((fill as D_PATTER).asset !== undefined) {
        this.fill = Pattern.createObj(Pattern, fill)
      }
    }

    // FIXME: 判断 stroke 的类型
    if (!!stroke && typeof stroke !== "string") {
      if ((stroke as D_GRADIENT).gradientShape) {
        this.stroke = Gradient.createObj(Gradient, stroke)
      } else if ((stroke as D_PATTER).asset !== undefined) {
        this.stroke = Pattern.createObj(Pattern, stroke)
      }
    }

    strokeParam && this.strokeParam.fromJSON(strokeParam)

    shadow && this.shadow.fromJSON(shadow)

    rotate && this.rotate.fromJSON(rotate)

    clip && this.clip.fromJSON(clip)
  }
}

export class FalseElement extends Element {
  public updateElementBox(box: Partial<Box>): void {
    throw new Error("Method not implemented.")
  }
  public countElementBox(ctx: CanvasRenderingContext2D): void {
    throw new Error("Method not implemented.")
  }
  public ATTRIBUTE_NAMES: any[] = Element.ELEMENT_ATTRIBUTES
  public readonly type = "element_false"
  public render(): void {
    throw new Error("Method not implemented.")
  }
}

export class Shadow extends Attribute implements D_SHADOW {
  public type: string = "attr_shadow"
  public ATTRIBUTE_NAMES: (keyof D_SHADOW)[] = [
    "shadowBlur",
    "shadowColor",
    "shadowOffsetX",
    "shadowOffsetY"
  ]

  shadowBlur: number = 0
  shadowColor: string = "rgba(0, 0, 0, 0)"
  shadowOffsetX: number = 0
  shadowOffsetY: number = 0

  static assertJsonTrue(json?: OmitType<D_SHADOW>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { shadowBlur, shadowColor, shadowOffsetX, shadowOffsetY } = json
    assertJsonType(shadowBlur, "number")
    assertJsonType(shadowColor, "string")
    assertJsonType(shadowOffsetX, "number")
    assertJsonType(shadowOffsetY, "number")
  }

  fromJSON(json: OmitType<D_SHADOW>): void {
    super.fromJSON(json)
  }
}

class Pattern extends Attribute implements D_PATTER {
  public type: string = "attr_pattern"
  public ATTRIBUTE_NAMES: (keyof D_PATTER)[] = ["asset", "repetition", "transform"]

  repetition: string = ""

  transform: DOMMatrix2DInit = {}

  asset!: number | D_ASSET_IMAGE

  uniqueIdent: string = ""

  genPattern(ctx: CanvasRenderingContext2D) {
    const { repetition, transform, uniqueIdent } = this
    const asset = assetManage.getAsset(uniqueIdent) as AssetImage
    if (!asset || !asset.element) {
      throw new Error("没有图片资源填充")
    }
    const pattern = ctx.createPattern(asset.element, repetition ?? null)
    pattern?.setTransform(transform)
    return pattern
  }

  static assertJsonTrue(json?: OmitType<D_PATTER>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { asset, repetition, transform } = json
    if (typeof asset !== "number") {
      AssetImage.assertJsonTrue(asset)
    }
    assertJsonType(repetition, "string")
    assertJsonType(transform, "array")
  }

  fromJSON(json: OmitType<D_PATTER>): void {
    const { asset } = json
    super.fromJSON(json)
    const assetImage = new AssetImage()
    if (asset !== undefined) {
      if (typeof asset === "number") {
        assetImage.id = asset
        this.uniqueIdent = assetImage.uniqueIdent
      } else {
        assetImage.fromJSON(asset)
        this.uniqueIdent = assetImage.uniqueIdent
      }
    }
  }
}

export class Gradient extends Attribute implements D_GRADIENT {
  public type: string = "attr_gradient"
  public ATTRIBUTE_NAMES: (keyof D_GRADIENT)[] = ["gradientShape", "gradientColors"]

  gradientColors: D_GRADIENT["gradientColors"] = []
  gradientShape: D_GRADIENT["gradientShape"] = [0, 0, 0, 0]

  genGradient(ctx: CanvasRenderingContext2D) {
    const { gradientShape, gradientColors } = this
    let gradient!: CanvasGradient
    if (gradientShape.length === 4) {
      gradient = ctx.createLinearGradient(...gradientShape)
    } else {
      gradient = ctx.createRadialGradient(...gradientShape)
    }
    for (const colorStop of gradientColors) {
      gradient.addColorStop(...colorStop)
    }
    return gradient
  }

  static assertJsonTrue(json?: OmitType<D_GRADIENT>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { gradientShape, gradientColors } = json
    assertJsonType(gradientShape, "array")
    assertJsonType(gradientColors, "array")
  }

  fromJSON(json: OmitType<D_GRADIENT>): void {
    super.fromJSON(json)
  }
}

export class StrokeParam extends Attribute implements D_STROKE_PARAM {
  public type: string = "attr_stroke_styles"
  public ATTRIBUTE_NAMES: (keyof D_STROKE_PARAM)[] = [
    "lineDash",
    "lineDashOffset",
    "lineCap",
    "lineJoin",
    "miterLimit",
    "lineWidth"
  ]

  static lineJoin = ["bevel", "miter", "round"]
  static lineCap = ["butt", "round", "square"]

  lineWidth: number = 2
  lineDash: number[] = []
  lineDashOffset: number = 0
  lineCap: CanvasLineCap = "butt"
  lineJoin: CanvasLineJoin = "bevel"
  miterLimit: number = 0

  takeEffect(ctx: CanvasRenderingContext2D): void {
    super.takeEffect(ctx)
    if (this.lineDash !== undefined) {
      this.setLineDash(ctx, this.lineDash)
    }
  }

  setLineDash(ctx: CanvasRenderingContext2D, dashArray: number[]) {
    if (!dashArray || dashArray.length === 0) {
      return
    }
    // Spec requires the concatenation of two copies the dash list when the number of elements is odd
    if (1 & dashArray.length) {
      dashArray.push(...dashArray)
    }
    ctx.setLineDash(dashArray)
  }

  static assertJsonTrue(json?: OmitType<D_STROKE_PARAM>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { lineDash, lineDashOffset, lineCap, lineJoin, miterLimit, lineWidth } = json
    assertJsonType(lineDash, "array")
    assertJsonType(lineDashOffset, "number")
    assetValueRange(lineCap, StrokeParam.lineCap)
    assetValueRange(lineJoin, StrokeParam.lineJoin)
    assertJsonType(miterLimit, "number")
    assertJsonType(lineWidth, "number")
  }

  fromJSON(json: OmitType<D_STROKE_PARAM>): void {
    super.fromJSON(json)
  }
}
