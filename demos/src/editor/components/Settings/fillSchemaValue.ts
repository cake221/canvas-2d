import { Element, Image, assetManage, Gradient } from "@canvas-2d/core/src"

export function fillSchemaValue(ele: Element) {
  const { origin, fill, stroke, fillRule, strokeParam } = ele
  const eleFromData: any = {}

  eleFromData.type = ele.type

  eleFromData.origin = {
    x: origin.x,
    y: origin.y
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
      const { lineDash, lineDashOffset, lineCap, lineJoin, miterLimit, lineWidth } = strokeParam
      if (lineDash !== undefined) {
        const dash = []
        for (const interval of lineDash) {
          dash.push({
            interval
          })
        }
        eleFromStrokeParamData.lineDash = dash
      }
      lineDashOffset !== undefined && (eleFromStrokeParamData.lineDashOffset = lineDashOffset)
      lineCap !== undefined && (eleFromStrokeParamData.lineCap = lineCap)
      lineJoin !== undefined && (eleFromStrokeParamData.lineJoin = lineJoin)
      miterLimit !== undefined && (eleFromStrokeParamData.miterLimit = miterLimit)
      lineWidth !== undefined && (eleFromStrokeParamData.lineWidth = lineWidth)
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
