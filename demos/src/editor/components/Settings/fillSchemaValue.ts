import {
  Element,
  Image,
  assetManage,
  Gradient,
  Paragraph,
  Shape,
  Path,
  Pattern
} from "@canvas-2d/core/src"
import { parseJsonData } from "@canvas-2d/shared"

export function fillSchemaValue(ele: Element) {
  const { origin, fill, stroke, fillRule, strokeParam, clip } = ele
  const eleFromData: any = {}

  eleFromData.type = ele.type

  eleFromData.origin = {
    x: origin.x,
    y: origin.y
  }

  {
    if (clip.path) {
      eleFromData.clip = {}
      const d_path: any = (eleFromData.clip.d_path = {})
      fillPathSchemaValue(clip.path, d_path)
    }
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
    } else if (Pattern.isPattern(stroke)) {
      eleFromData.strokeType = "strokePattern"
      const asset = assetManage.getAsset(stroke.asset)
      eleFromData.strokePattern = {
        repetition: stroke.repetition,
        imageData: asset?.data
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
    } else if (Pattern.isPattern(fill)) {
      eleFromData.fillType = "fillPattern"
      const asset = assetManage.getAsset(fill.asset)
      eleFromData.fillPattern = {
        repetition: fill.repetition,
        imageData: asset?.data
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

  if (ele.type === "shape") {
    eleFromData.shapeData = {}
    fillShapeSchemaValue(ele as Shape, eleFromData.shapeData)
  }
  return eleFromData
}

function fillParagraphSchemaValue(paragraph: Paragraph, paragraphFromData: any) {
  parseJsonData(paragraphFromData, paragraph, paragraph.ATTRIBUTE_NAMES)
  {
    paragraphFromData.font = {}
    parseJsonData(paragraphFromData.font, paragraph.font, paragraph.font.ATTRIBUTE_NAMES)
  }
}

function fillImageSchemaValue(image: Image, imageFromData: any) {
  parseJsonData(imageFromData, image, image.ATTRIBUTE_NAMES)
  {
    const asset = assetManage.getAsset(image.asset)
    imageFromData.imageData = asset?.data
  }
}

function fillShapeSchemaValue(shape: Shape, shapeFormData: any) {
  parseJsonData(shapeFormData, shape, shape.ATTRIBUTE_NAMES)

  {
    if (shape.path) {
      const d_path: any = (shapeFormData.d_path = {})
      fillPathSchemaValue(shape.path, d_path)
    }
  }
}

function fillPathSchemaValue(path: Path, d_path: any) {
  d_path.type = path.type
  if (path.type === "ellipse") {
    d_path.ellipseData = {}
    parseJsonData(d_path.ellipseData, path, path.ATTRIBUTE_NAMES)
  } else if (path.type === "rect") {
    d_path.rectData = {}
    parseJsonData(d_path.rectData, path, path.ATTRIBUTE_NAMES)
  }
}
