import { assertNever } from "@canvas-2d/shared"

import { D_PATH } from "../type"
import { Path } from "./_path"
import { Rect } from "./rect"
import { Ellipse } from "./ellipse"
import { Arc } from "./arc"
import { Path_Path } from "./path-path"
import { Polygon } from "./polygon"

export function genPath(layer: D_PATH): Path {
  switch (layer.type) {
    case "rect":
      return Rect.createObj(Rect, layer)
    case "arc":
      return Arc.createObj(Arc, layer)
    case "ellipse":
      return Ellipse.createObj(Ellipse, layer)
    case "path":
      return Path_Path.createObj(Path_Path, layer)
    case "polygon":
      return Polygon.createObj(Polygon, layer)
    default:
      assertNever(layer)
  }
}

export * from "./_path"
export * from "./arc"
export * from "./ellipse"
export * from "./path-path"
export * from "./rect"
