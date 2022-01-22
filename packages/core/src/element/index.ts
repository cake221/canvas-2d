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
      return Text.createObj(Text, layer)
    case "paragraph":
      return Paragraph.createObj(Paragraph, layer)
    case "element_false":
      return FalseElement.createObj(FalseElement, layer)
    default:
      assertNever(layer)
  }
}

export function assetElement(layer: D_ELEMENT) {
  switch (layer.type) {
    case "shape":
      return Shape.assertJsonTrue(layer)
    case "image":
      return Image.assertJsonTrue(layer)
    case "text":
      return Text.assertJsonTrue(layer)
    case "paragraph":
      return Paragraph.assertJsonTrue(layer)
    case "element_false":
      return FalseElement.assertJsonTrue(layer)
    default:
      assertNever(layer)
  }
}

export * from "./shape"
export * from "./image"
export * from "./text"
export * from "./_element"
