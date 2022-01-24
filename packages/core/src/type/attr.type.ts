import { Point } from "@canvas-2d/shared"

import { D_PATH } from "./path.type"
import { D_ASSET_IMAGE, Asset_ID } from "./asset.type"

export interface D_ATTR_BASE {}

export interface D_ROTATE {
  angle?: number
}

export interface D_STROKE_PARAM
  extends Partial<Omit<CanvasPathDrawingStyles, "getLineDash" | "setLineDash">> {
  lineDash?: number[]
}

export interface D_CLIP extends D_ATTR_BASE {
  d_path: D_PATH
}

export type D_SHADOW = Partial<CanvasShadowStyles>

export type D_ORIGIN = Partial<Point>

export type LinerGradient = [number, number, number, number] // [x0: number, y0: number, x1: number, y1: number]
export type RadialGradient = [number, number, number, number, number, number] // [x0: number, y0: number, r0: number, x1: number, y1: number, r1: number]
export type ColorStop = [number, string] // [offset: number, color: string]
export type GradientShape = LinerGradient | RadialGradient

export interface D_GRADIENT extends D_ATTR_BASE {
  type: "attr_gradient"
  gradientShape: GradientShape
  gradientColors: ColorStop[]
}

export type PatternRepetition = "repeat" | "repeat-x" | "repeat-y" | "no-repeat"

export interface D_PATTER extends D_ATTR_BASE {
  type: "attr_pattern"
  repetition?: PatternRepetition
  transform?: DOMMatrix2DInit
  asset: Asset_ID | D_ASSET_IMAGE
}

export interface D_FONT extends D_ATTR_BASE {
  fontFamily?: string
  fontSize?: number
  fontStyle?: string
  fontVariant?: string
  fontWeight?: number | string
  lineHeight?: number
}

export type D_ATTR = D_FONT | D_ROTATE | D_ORIGIN
