import {
  D_ELEMENT,
  D_IMAGE,
  Element,
  Image,
  assetManage,
  D_STROKE_PARAM,
  D_TEXT_BOX,
  Paragraph,
  Font
} from "@canvas-2d/core/src"
import { parseJsonData } from "@canvas-2d/shared"

export function parseSchemaValue(value: any, ele: Element): D_ELEMENT {
  // @ts-ignore
  const eleData: D_ELEMENT = {}

  eleData.type = ele.type

  eleData.origin = value.origin

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

  {
    if (value.strokeType === "strokeColor") {
      eleData.stroke = value[value.strokeType] ?? ""
    } else if (value.strokeType === "strokeGradient") {
      const { gradientColors, gradientShape } = value[value.strokeType]
      eleData.stroke = {
        type: "attr_gradient",
        gradientColors,
        gradientShape
      }
    } else {
      throw new Error("暂不支持")
    }
  }

  {
    if (value.fillType === "fillColor") {
      eleData.fill = value[value.fillType] ?? ""
    } else if (value.fillType === "fillGradient") {
      const { gradientColors, gradientShape } = value[value.fillType]
      eleData.fill = {
        type: "attr_gradient",
        gradientColors,
        gradientShape
      }
    } else {
      throw new Error("暂不支持")
    }
  }

  eleData.fillRule = value.fillRule

  if (eleData.type === "image") {
    parseImageSchemaValue(eleData, value.imageData, ele as Image)
  }

  if (eleData.type === "paragraph") {
    parseParagraphSchemaValue(eleData, value.paragraphData, ele as Paragraph)
  }
  return eleData
}

function parseParagraphSchemaValue(eleData: D_TEXT_BOX, value: any, paragraph: Paragraph) {
  if (value.font) {
    eleData.font = {}
    parseJsonData(eleData.font, value.font)
  }
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
