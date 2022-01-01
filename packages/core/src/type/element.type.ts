import {
  D_ORIGIN,
  D_GRADIENT,
  D_PATTER,
  D_STROKE_PARAM,
  D_TRANSFORM,
  D_SHADOW,
  D_CLIP,
  D_FONT
} from "./attr.type"
import { D_PATH } from "./path.type"
import { PartialOmit } from "./_type"

export type D_FillStoke = string | D_GRADIENT | D_PATTER

export interface D_ELEMENT_BASE {
  origin?: D_ORIGIN

  fill?: D_FillStoke
  stroke?: D_FillStoke
  strokeParam?: D_STROKE_PARAM
  fillRule?: CanvasFillRule
  filter?: string
  transform?: D_TRANSFORM
  shadow?: D_SHADOW

  clip?: D_CLIP
}

export interface D_FALSE_ELEMENT extends D_ELEMENT_BASE {
  type: "element_false"
}

export interface D_SHAPE extends D_ELEMENT_BASE {
  type: "shape"
  d_path: D_PATH
}

export interface D_IMAGE extends D_ELEMENT_BASE {
  type: "image"
  width: Number
  height: number
  assetId: number
  cropX?: number
  cropY?: number
  imageSmoothing?: boolean
  imageSmoothingQuality?: ImageSmoothingQuality
}

export interface D_TEXT_BASE extends D_ELEMENT_BASE, PartialOmit<CanvasTextDrawingStyles, "font"> {
  type: "text" | "paragraph"
  text: string
  font?: D_FONT
  border?: string
  background?: string
}

export interface D_TEXT extends D_TEXT_BASE {
  type: "text"
}

export interface D_TEXT_BOX extends D_TEXT_BASE {
  type: "paragraph"
}

export type D_ELEMENT = D_SHAPE | D_IMAGE | D_TEXT | D_TEXT_BOX | D_FALSE_ELEMENT
export type ImageType = D_IMAGE["type"]
export type TextType = D_TEXT_BASE["type"]
export type ElementType = D_ELEMENT["type"]
