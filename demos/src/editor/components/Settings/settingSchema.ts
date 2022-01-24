import { Element, StrokeParam, Image, Paragraph } from "@canvas-2d/core/src"

const gradientSchema = {
  gradientColors: {
    title: "gradientColors",
    type: "array",
    widget: "gradientInput"
  },
  gradientShape: {
    title: "gradientShape",
    type: "array",
    widget: "gradientInput"
  }
}

const strokeSchema = {
  strokeType: {
    title: "描边类型",
    description: "下拉单选",
    type: "string",
    enum: ["strokeColor", "strokeGradient", "strokePattern"],
    enumNames: ["描边颜色", "描边渐变", "描边模式"],
    widget: "select",
    labelWidth: 160
  },
  strokeColor: {
    title: "描边颜色",
    type: "string",
    hidden: "{{formData.strokeType !== 'strokeColor'}}",
    format: "color",
    props: {}
  },
  strokeGradient: {
    title: "描边渐变",
    type: "object",
    hidden: "{{formData.strokeType !== 'strokeGradient'}}",
    properties: {
      ...gradientSchema
    }
  },
  strokePattern: {
    title: "描边模式",
    type: "string",
    hidden: "{{formData.strokeType !== 'strokePattern'}}",
    props: {}
  },
  strokeParam: {
    title: "strokeParam",
    type: "object",
    properties: {
      lineWidth: { title: "lineWidth", type: "number" },
      lineJoin: {
        title: "lineJoin",
        description: "下拉单选",
        type: "string",
        enum: StrokeParam.lineJoin,
        enumNames: ["bevel", "miter", "round"],
        widget: "select",
        labelWidth: 160
      },
      miterLimit: { title: "miterLimit", type: "number", hidden: true },
      lineDash: {
        title: "lineDash",
        type: "array",
        items: {
          type: "object",
          properties: {
            interval: {
              title: "线条间隔",
              type: "number"
            }
          }
        }
      },
      lineDashOffset: {
        title: "lineDashOffset",
        type: "number",
        hidden:
          "{{formData.strokeParam.lineDash.length === 0 || !formData.strokeParam.lineDash[0].interval || formData.strokeParam.lineDash[0].interval < 0}}"
      },
      lineCap: {
        title: "lineCap",
        description: "下拉单选",
        type: "string",
        enum: StrokeParam.lineCap,
        enumNames: ["butt", "round", "square"],
        widget: "select",
        labelWidth: 160,
        hidden:
          "{{formData.strokeParam.lineDash.length === 0 || !formData.strokeParam.lineDash[0].interval || formData.strokeParam.lineDash[0].interval < 0}}"
      }
    }
  }
}

const fillSchema = {
  fillType: {
    title: "填充类型",
    description: "下拉单选",
    type: "string",
    enum: ["fillColor", "fillGradient", "fillPattern"],
    enumNames: ["填充颜色", "填充渐变", "填充模式"],
    widget: "select",
    labelWidth: 160
  },
  fillColor: {
    title: "填充颜色",
    type: "string",
    hidden: "{{formData.fillType !== 'fillColor'}}",
    format: "color",
    props: {}
  },
  fillGradient: {
    title: "填充渐变",
    type: "object",
    hidden: "{{formData.fillType !== 'fillGradient'}}",
    properties: {
      ...gradientSchema
    }
  },
  fillPattern: {
    title: "填充模式",
    type: "string",
    hidden: "{{formData.fillType !== 'fillPattern'}}",
    props: {}
  },
  fillRule: {
    title: "fillRule",
    description: "下拉单选",
    type: "string",
    enum: Element.fillRule,
    enumNames: ["奇偶规则", "非零规则"],
    widget: "select",
    labelWidth: 160
  }
}

const ImageSchema = {
  imageData: {
    title: "图片",
    type: "string",
    widget: "imageUpload"
  },
  width: {
    title: "width",
    type: "number",
    min: 0
  },
  height: {
    title: "width",
    type: "number",
    min: 0
  },
  imageSmoothing: {
    title: "imageSmoothing",
    type: "boolean"
  },
  imageSmoothingQuality: {
    title: "imageSmoothing",
    type: "string",
    enum: Image.imageSmoothingQuality,
    enumNames: Image.imageSmoothingQuality,
    widget: "select",
    labelWidth: 160
  }
}

const ParagraphSchema = {
  width: {
    title: "width",
    type: "number",
    min: 0
  },
  height: {
    title: "width",
    type: "number",
    min: 0
  },
  text: {
    title: "text",
    type: "string",
    format: "textarea",
    props: {
      row: 4
    }
  },
  textAlign: {
    title: "textAlign",
    type: "string",
    enum: Paragraph.textAlign,
    enumNames: Paragraph.textAlign,
    widget: "select",
    labelWidth: 160
  },
  textBaseline: {
    title: "direction",
    type: "string",
    enum: Paragraph.textBaseline,
    enumNames: Paragraph.textBaseline,
    widget: "select",
    labelWidth: 160
  },
  direction: {
    title: "direction",
    type: "string",
    enum: Paragraph.direction,
    enumNames: Paragraph.direction,
    widget: "select",
    labelWidth: 160
  },
  font: {
    title: "字体",
    type: "object",
    properties: {
      fontSize: {
        title: "fontSize",
        type: "number"
      },
      fontFamily: {
        title: "fontFamily",
        type: "string"
      },
      fontStyle: {
        title: "fontStyle",
        type: "string"
      },
      fontVariant: {
        title: "fontVariant",
        type: "string"
      },
      fontWeight: {
        title: "fontWeight",
        type: "string"
      },
      lineHeight: {
        title: "lineHeight",
        type: "number"
      }
    }
  }
}

export const settingSchema = {
  type: "object",
  properties: {
    type: {
      type: "string",
      readonly: true
    },
    origin: {
      title: "Origin",
      type: "object",
      properties: {
        x: {
          title: "源点的X坐标",
          type: "number"
        },
        y: {
          title: "源点的Y坐标",
          type: "number"
        }
      }
    },
    rotate: {
      title: "rotate",
      type: "object",
      properties: {
        angle: {
          title: "渲染的角度",
          type: "number",
          min: 0
        }
      }
    },
    shadow: {
      title: "阴影",
      type: "object",
      properties: {
        shadowBlur: {
          title: "shadowBlur",
          type: "number",
          min: 0
        },
        shadowColor: {
          title: "shadowColor",
          type: "string",
          format: "color"
        },
        shadowOffsetX: {
          title: "shadowOffsetX",
          type: "number",
          min: 0
        },
        shadowOffsetY: {
          title: "shadowOffsetY",
          type: "number",
          min: 0
        }
      }
    },
    ...strokeSchema,
    ...fillSchema,
    imageData: {
      title: "图像配置",
      type: "object",
      hidden: "{{formData.type !== 'image'}}",
      properties: {
        ...ImageSchema
      }
    },
    paragraphData: {
      title: "文本配置",
      type: "object",
      hidden: "{{formData.type !== 'paragraph'}}",
      properties: {
        ...ParagraphSchema
      }
    }
  },
  labelWidth: 120,
  displayType: "row"
}
