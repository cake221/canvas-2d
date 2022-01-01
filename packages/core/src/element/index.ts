import { assertNever } from "@canvas-2d/shared"

import { D_ELEMENT } from "../type"
import { Element, FalseElement } from "./_element"
import { Shape } from "./shape"
import { Text, Paragraph } from "./text"
import { Image } from "./image"

export function genElement(layer: D_ELEMENT): Element {
  switch (layer.type) {
    case "shape":
      return Shape.createObj(Shape, layer)
    case "image":
      return Image.createObj(Image, layer)
    case "text":
      return Image.createObj(Text, layer)
    case "paragraph":
      return Paragraph.createObj(Paragraph, layer)
    case "element_false":
      return Image.createObj(FalseElement, layer)
    default:
      assertNever(layer)
  }
}

export * from "./shape"
export * from "./image"
export * from "./text"
export * from "./_element"
