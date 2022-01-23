import {
  D_ELEMENT,
  D_IMAGE,
  Element,
  Image,
  assetManage,
  D_STROKE_PARAM
} from "@canvas-2d/core/src"

export function parseSchemaValue(value: any, ele: Element): D_ELEMENT {
  // @ts-ignore
  const eleData: D_ELEMENT = {}

  eleData.type = ele.type

  eleData.origin = value.origin

  eleData.stroke = value[value.strokeType]

  if (value.strokeParam) {
    const { lineDash, lineDashOffset, lineCap, lineJoin, miterLimit, lineWidth } = value.strokeParam
    const strokeParam: D_STROKE_PARAM = (eleData.strokeParam = {})
    if (lineDash !== undefined) {
      const dash = []
      for (const item of lineDash) {
        dash.push(item.interval ?? 0)
      }
      strokeParam.lineDash = dash
    }
    lineDashOffset !== undefined && (strokeParam.lineDashOffset = lineDashOffset)
    lineCap !== undefined && (strokeParam.lineCap = lineCap)
    lineJoin !== undefined && (strokeParam.lineJoin = lineJoin)
    miterLimit !== undefined && (strokeParam.miterLimit = miterLimit)
    lineWidth !== undefined && (strokeParam.lineWidth = lineWidth)
  }

  eleData.fill = value[value.fillType]

  eleData.fillRule = value.fillRule

  if (eleData.type === "image") {
    parseImageSchemaValue(eleData, value, ele as Image)
  }
  return eleData
}

function parseImageSchemaValue(eleData: D_IMAGE, value: any, image: Image) {
  {
    const asset = assetManage.getAsset(image.uniqueIdent)
    if (value.imageData && asset?.data !== value.imageData) {
      eleData.asset = {
        type: "asset_image",
        data: value.imageData
      }
    }
  }
}
