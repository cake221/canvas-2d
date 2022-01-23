import { Element, Image, assetManage } from "@canvas-2d/core/src"

export function fillSchemaValue(ele: Element) {
  const { origin, fill, stroke, fillRule } = ele
  const eleFromData: any = {}

  eleFromData.type = ele.type

  eleFromData.origin = {
    x: origin.x,
    y: origin.y
  }

  fillRule && (eleFromData.fillRule = fillRule)

  {
    if (typeof stroke === "string") {
      eleFromData.strokeType = "strokeColor"
      eleFromData.strokeColor = stroke
    }
  }

  {
    if (typeof fill === "string") {
      eleFromData.fillType = "fillColor"
      eleFromData.fillColor = fill
    }
  }

  if (ele.type === "image") {
    fillImageValue(ele as Image, eleFromData)
  }
  return eleFromData
}

function fillImageValue(ele: Image, imageFromData: any) {
  {
    const asset = assetManage.getAsset(ele.uniqueIdent)
    imageFromData.imageData = asset?.data
  }
}
