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

type LinerGradient = [number, number, number, number] // [x0: number, y0: number, x1: number, y1: number]
type RadialGradient = [number, number, number, number, number, number] // [x0: number, y0: number, r0: number, x1: number, y1: number, r1: number]
type ColorStop = [number, string] // [offset: number, color: string]

export interface D_GRADIENT extends D_ATTR_BASE {
  gradientShape: LinerGradient | RadialGradient
  gradientColors: ColorStop[]
}

export interface D_PATTER extends D_ATTR_BASE {
  repetition?: string
  transform?: DOMMatrix2DInit
  d_asset: Asset_ID | D_ASSET_IMAGE
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
