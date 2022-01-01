import { D_ORIGIN } from "./attr.type"

export interface D_PATH_BASE {
  origin?: D_ORIGIN
}

// 矩形
export interface D_PATH_RECTANGLE extends D_PATH_BASE {
  type: "rect"
  rx?: number
  ry?: number
  width: number
  height: number
  x?: number
  y?: number
}

export interface D_PATH_POLYGON extends D_PATH_BASE {
  type: "polygon"
  centerX: number
  centerY: number
  radius: number
  sides: number
  startAngle?: number
}

// 椭圆
export interface D_PATH_ELLIPSE extends D_PATH_BASE {
  type: "ellipse"
  x?: number
  y?: number
  radiusX: number
  radiusY: number
  rotation?: number
  startAngle?: number
  endAngle?: number
  anticlockwise?: boolean
}

// 圆
export interface D_PATH_ARC extends D_PATH_BASE {
  type: "arc"
  x?: number
  y?: number
  radius: number
  startAngle?: number
  endAngle?: number
  anticlockwise?: boolean
}

export interface D_PATH_PATH extends D_PATH_BASE {
  type: "path"
  path: string
}

export type D_PATH = D_PATH_RECTANGLE | D_PATH_ELLIPSE | D_PATH_ARC | D_PATH_PATH | D_PATH_POLYGON
