import { Element } from "@canvas-2d/core/src"

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
      type: "string",
      hidden: "{{formData.fillType !== 'fillGradient'}}",
      props: {}
    },
    fillPattern: {
      title: "填充模式",
      type: "string",
      hidden: "{{formData.fillType !== 'fillPattern'}}",
      props: {}
    },
    fillRule: {
      title: "填充规则",
      description: "下拉单选",
      type: "string",
      enum: Element.fillRule,
      enumNames: ["奇偶规则", "非零规则"],
      widget: "select",
      labelWidth: 160
    },
    imageData: {
      title: "图片",
      type: "string",
      hidden: "{{formData.type !== 'image'}}",
      widget: "imageUpload"
    }
  },
  labelWidth: 120,
  displayType: "row"
}
