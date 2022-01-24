import { Element, Image, assetManage, Gradient, Paragraph, Font } from "@canvas-2d/core/src"
import { parseJsonData } from "@canvas-2d/shared"

export function fillSchemaValue(ele: Element) {
  const { origin, fill, stroke, fillRule, strokeParam } = ele
  const eleFromData: any = {}

  eleFromData.type = ele.type

  eleFromData.origin = {
    x: origin.x,
    y: origin.y
  }

  {
    eleFromData.rotate = {}
    parseJsonData(eleFromData.rotate, ele.rotate, ele.rotate.ATTRIBUTE_NAMES)
  }

  {
    eleFromData.shadow = {}
    parseJsonData(eleFromData.shadow, ele.shadow, ele.shadow.ATTRIBUTE_NAMES)
  }

  {
    if (typeof stroke === "string") {
      eleFromData.strokeType = "strokeColor"
      eleFromData.strokeColor = stroke
    } else if (Gradient.isGradient(stroke)) {
      eleFromData.strokeType = "strokeGradient"
      eleFromData.strokeGradient = {
        gradientColors: Array.from(stroke.gradientColors),
        gradientShape: Array.from(stroke.gradientShape)
      }
    } else {
      throw new Error("暂不支持")
    }

    if (strokeParam) {
      const eleFromStrokeParamData: any = {}
      parseJsonData(eleFromStrokeParamData, strokeParam, strokeParam.ATTRIBUTE_NAMES)
      const { lineDash } = strokeParam
      if (lineDash !== undefined) {
        const dash = []
        for (const interval of lineDash) {
          dash.push({
            interval
          })
        }
        eleFromStrokeParamData.lineDash = dash
      }
      eleFromData.strokeParam = eleFromStrokeParamData
    }
  }

  {
    if (typeof fill === "string") {
      eleFromData.fillType = "fillColor"
      eleFromData.fillColor = fill
    } else if (Gradient.isGradient(fill)) {
      eleFromData.fillType = "fillGradient"
      eleFromData.fillGradient = {
        gradientColors: Array.from(fill.gradientColors),
        gradientShape: Array.from(fill.gradientShape)
      }
    } else {
      throw new Error("暂不支持")
    }

    fillRule && (eleFromData.fillRule = fillRule)
  }

  if (ele.type === "image") {
    eleFromData.imageData = {}
    fillImageSchemaValue(ele as Image, eleFromData.imageData)
  }

  if (ele.type === "paragraph") {
    eleFromData.paragraphData = {}

    fillParagraphSchemaValue(ele as Paragraph, eleFromData.paragraphData)
  }
  return eleFromData
}

function fillParagraphSchemaValue(paragraph: Paragraph, paragraphFromData: any) {
  {
    paragraphFromData.font = {}
    parseJsonData(paragraphFromData.font, paragraph.font, paragraph.font.ATTRIBUTE_NAMES)
  }
}

function fillImageSchemaValue(ele: Image, imageFromData: any) {
  {
    const asset = assetManage.getAsset(ele.uniqueIdent)
    imageFromData.imageData = asset?.data
  }
}
