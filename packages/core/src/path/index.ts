import { assertNever } from "@canvas-2d/shared"

import { D_PATH } from "../type"
import { Path } from "./_path"
import { Rect } from "./rect"
import { Ellipse } from "./ellipse"
import { Arc } from "./arc"
import { Path_Path } from "./path-path"
import { Polygon } from "./polygon"

export function genPath(path: D_PATH): Path {
  switch (path.type) {
    case "rect":
      return Rect.createObj(Rect, path)
    case "arc":
      return Arc.createObj(Arc, path)
    case "ellipse":
      return Ellipse.createObj(Ellipse, path)
    case "path":
      return Path_Path.createObj(Path_Path, path)
    case "polygon":
      return Polygon.createObj(Polygon, path)
    default:
      assertNever(path)
  }
}

export function assetPath(path?: D_PATH) {
  if (path === undefined) return
  switch (path.type) {
    case "rect":
      return Rect.assertJsonTrue(path)
    case "arc":
      return Arc.assertJsonTrue(path)
    case "ellipse":
      return Ellipse.assertJsonTrue(path)
    case "path":
      return Path_Path.assertJsonTrue(path)
    case "polygon":
      return Polygon.assertJsonTrue(path)
    default:
      assertNever(path)
  }
}

export * from "./_path"
export * from "./arc"
export * from "./ellipse"
export * from "./path-path"
export * from "./rect"
