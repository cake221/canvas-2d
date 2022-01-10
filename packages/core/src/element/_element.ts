import {
  point_add,
  TRANSFORM_MATRIX,
  Point,
  transformPoint,
  scalePoint,
  translatePoint,
  rotatePoint
} from "@canvas-2d/shared"

import { Base } from "../base"
import { Frame } from "../frame"
import { Attribute, Origin } from "../attr"
import {
  D_ELEMENT_BASE,
  ElementType,
  D_TRANSFORM,
  D_SHADOW,
  D_PATTER,
  D_STROKE_PARAM,
  D_GRADIENT,
  D_CLIP,
  D_PATH
} from "../type"
import { AssetImage } from "../asset"
import { genPath, Path, Path_Path } from "../path"

export interface RenderParam {
  trans?: Transform[]
}

export abstract class Element extends Base implements D_ELEMENT_BASE {
  public abstract readonly type: ElementType
  public abstract render(ctx: CanvasRenderingContext2D): void
  public abstract countFrameElement(ctx: CanvasRenderingContext2D): void

  static ELEMENT_ATTRIBUTES: (keyof D_ELEMENT_BASE)[] = [
    "fill",
    "stroke",
    "fillRule",
    "strokeParam",
    "transform",
    "origin",
    "shadow",
    "filter",
    "clip"
  ]

  renderParam?: RenderParam

  fill: string | Gradient | Pattern = "rgba(0, 0, 0, 0)"

  stroke: string | Gradient | Pattern = "rgba(0, 0, 0, 0)"

  strokeParam?: StrokeParam

  fillRule?: CanvasFillRule

  shadow?: Shadow

  transform?: Transform

  filter?: string

  origin: Origin = new Origin()

  clip?: Clip

  elementFrame = new Frame()

  setShadow(ctx: CanvasRenderingContext2D) {
    this.shadow?.takeEffect(ctx)
  }

  setTransform(ctx: CanvasRenderingContext2D) {
    this.transform?.takeEffect(ctx, this.renderParam?.trans)
  }

  renderBefore(ctx: CanvasRenderingContext2D) {
    this.setTransform(ctx)
  }

  renderAfter(ctx: CanvasRenderingContext2D) {
    this.countFrameElement(ctx)
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
    this.clip?.takeEffect(ctx, this.fillRule)
  }

  fromJSON(json: D_ELEMENT_BASE): void {
    super.fromJSON(json)
    const { strokeParam, shadow, transform, fill, stroke, clip } = json

    this.origin = Origin.createObj(Origin, json.origin!)

    if (!!fill && typeof fill !== "string") {
      if ((fill as D_GRADIENT).gradientShape) {
        this.fill = Gradient.createObj(Gradient, fill)
      } else if ((fill as D_PATTER).assetId !== undefined) {
        this.fill = Pattern.createObj(Pattern, fill)
      }
    }

    if (!!stroke && typeof stroke !== "string") {
      if ((stroke as D_GRADIENT).gradientShape) {
        this.stroke = Gradient.createObj(Gradient, stroke)
      } else if ((stroke as D_PATTER).assetId !== undefined) {
        this.stroke = Pattern.createObj(Pattern, stroke)
      }
    }

    if (strokeParam) {
      this.strokeParam = StrokeParam.createObj(StrokeParam, strokeParam)
    }

    if (shadow) {
      this.shadow = Shadow.createObj(Shadow, shadow)
    }

    if (transform) {
      this.transform = Transform.createObj(Transform, transform)
    }

    if (clip) {
      const clipObj = new Clip()
      clipObj.fromJSON(clip, json)
      this.clip = clipObj
    }
  }
}

export class FalseElement extends Element {
  public countFrameElement(ctx: CanvasRenderingContext2D): void {
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

  shadowBlur?: number
  shadowColor?: string
  shadowOffsetX?: number
  shadowOffsetY?: number
}

export class Transform extends Attribute implements D_TRANSFORM {
  static IdentityMatrix: TRANSFORM_MATRIX = [1, 0, 0, 1, 0, 0]

  public type: string = "attr_transform"

  public ATTRIBUTE_NAMES: (keyof D_TRANSFORM)[] = [
    "transformMatrix",
    "angleCenterX",
    "angleCenterY",
    "angle",
    "scaleX",
    "scaleY",
    "offsetX",
    "offsetY"
  ]

  transformMatrix?: TRANSFORM_MATRIX
  offsetX?: number
  offsetY?: number
  scaleX?: number
  scaleY?: number
  angle?: number
  angleCenterX?: number
  angleCenterY?: number

  setAngleCenter(p: Point) {
    this.angleCenterX = p.x
    this.angleCenterY = p.y
  }

  applyTransform(trans: Transform) {
    const { offsetX, offsetY, scaleX, scaleY, angle } = trans

    offsetX && (this.offsetX = (this.offsetX ?? 0) + offsetX)
    offsetY && (this.offsetY = (this.offsetY ?? 0) + offsetY)
    scaleX && (this.scaleX = (this.scaleX ?? 1) * scaleX)
    scaleY && (this.scaleY = (this.scaleY ?? 1) * scaleY)
    angle && (this.angle = (this.angle ?? 0) + angle)
  }

  transformPoint(p: Point) {
    const {
      scaleX,
      scaleY,
      angle,
      transformMatrix,
      offsetX,
      offsetY,
      angleCenterY,
      angleCenterX
    } = this

    if (angle) {
      p = translatePoint(p, angleCenterX, angleCenterY)
      p = rotatePoint(p, angle)
      p = translatePoint(p, -(angleCenterX ?? 0), -(angleCenterY ?? 0))
    }

    ;(offsetX || offsetY) && (p = translatePoint(p, offsetX, offsetY))
    // ;(scaleX || scaleY) && (p = scalePoint(p, scaleX, scaleY))
    // p = transformPoint(p, transformMatrix)

    return p
  }

  reset() {
    this.offsetX = 0
    this.offsetY = 0
    this.scaleX = 1
    this.scaleY = 1
    this.angle = 0
    this.transformMatrix = Transform.IdentityMatrix
  }

  // 一个元素，只能有一次变换
  takeEffect(ctx: CanvasRenderingContext2D, transform?: Transform[]): void {
    const {
      scaleX,
      scaleY,
      angle,
      transformMatrix,
      offsetX,
      offsetY,
      angleCenterY,
      angleCenterX
    } = this
    if (transform) {
      const transGroup = new Transform()
      transform.forEach((trans) => transGroup.applyTransform(trans))
      transGroup.applyTransform(this)
      transGroup.takeEffect(ctx)
      return
    }

    ctx.resetTransform()
    if (transformMatrix) {
      ctx.transform(...transformMatrix)
      return
    }
    if (angle) {
      ctx.translate(angleCenterX ?? 0, angleCenterY ?? 0)
      ctx.rotate(angle)
      ctx.translate(-(angleCenterX ?? 0), -(angleCenterY ?? 0))
    }

    ;(offsetX || offsetY) && ctx.translate(offsetX ?? 0, offsetY ?? 0)
    ;(scaleX || scaleY) && ctx.scale(scaleX ?? 1, scaleY ?? 1)
  }
}

class Pattern extends Attribute implements D_PATTER {
  public type: string = "attr_pattern"
  public ATTRIBUTE_NAMES: (keyof D_PATTER)[] = ["assetId", "repetition", "transform"]

  repetition?: string
  transform?: DOMMatrix2DInit
  assetId!: number

  assetImage: AssetImage | null = null

  genPattern(ctx: CanvasRenderingContext2D) {
    const { repetition, assetImage, transform } = this
    if (!assetImage) return null
    const pattern = ctx.createPattern(assetImage.element!, repetition ?? null)
    pattern?.setTransform(transform)
    return pattern
  }

  fromJSON(json: D_PATTER): void {
    super.fromJSON(json)
    const { assetId } = this
    this.assetImage = AssetImage.getAsset(
      AssetImage.getUniqueIdent("asset_image", assetId)
    ) as AssetImage
  }
}

export class Gradient extends Attribute implements D_GRADIENT {
  public type: string = "attr_gradient"
  public ATTRIBUTE_NAMES: (keyof D_GRADIENT)[] = ["gradientShape", "gradientColors"]

  gradientColors: D_GRADIENT["gradientColors"] = []
  gradientShape!: D_GRADIENT["gradientShape"]

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
}

export class Clip extends Attribute implements D_CLIP {
  public type: string = "attr_clip"

  public ATTRIBUTE_NAMES: (keyof D_CLIP)[] = ["d_path"]

  path!: Path

  d_path!: D_PATH

  takeEffect(ctx: CanvasRenderingContext2D, fillRule?: CanvasFillRule): void {
    this.path.genPath(ctx)
    const { path } = this
    if (path instanceof Path_Path) {
      const path2d = new Path2D(path.path)
      if (fillRule === "evenodd") {
        ctx.clip(path2d, fillRule)
      } else {
        ctx.clip(path2d)
      }
    } else {
      if (fillRule === "evenodd") {
        ctx.clip(fillRule)
      } else {
        ctx.clip()
      }
    }
  }

  fromJSON(json: D_CLIP, parent?: D_ELEMENT_BASE): void {
    super.fromJSON(json)
    const { d_path } = json
    d_path.origin = point_add(parent?.origin, d_path.origin)
    this.path = genPath(d_path)
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

  lineWidth?: number
  lineDash?: number[]
  lineDashOffset?: number
  lineCap?: CanvasLineCap
  lineJoin?: CanvasLineJoin
  miterLimit?: number

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
}
