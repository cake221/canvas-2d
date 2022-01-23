import { Element, StrokeParam } from "@canvas-2d/core/src"

const gradientSchema = {}

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
    type: "string",
    hidden: "{{formData.strokeType !== 'strokeGradient'}}",
    props: {}
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
    hidden: "{{formData.type !== 'image'}}",
    widget: "imageUpload"
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
    ...strokeSchema,
    ...fillSchema,
    ...ImageSchema
  },
  labelWidth: 120,
  displayType: "row"
}
