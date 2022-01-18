import {
  genTextLine,
  TextBox,
  countTextBoxByTextMetrics,
  addTextLineBox,
  updateText,
  Point,
  Box
} from "@canvas-2d/shared"

import { Element } from "./_element"
import { TextType, D_TEXT, D_FONT, D_TEXT_BOX, D_TEXT_BASE, OmitType } from "../type"
import { Attribute } from "../attr"
import { D_SHAPE } from "../type"
import { Shape } from "./shape"

export abstract class TextBase extends Element implements D_TEXT_BASE {
  public type: TextType = "text"

  ATTRIBUTE_NAMES: (keyof D_TEXT_BASE)[] = [
    "font",
    "text",
    "textAlign",
    "textBaseline",
    "direction",
    "border",
    "background"
  ]

  constructor() {
    super()
    this.ATTRIBUTE_NAMES.push(...Element.ELEMENT_ATTRIBUTES)
  }

  textBox: TextBox = new TextBox()

  font!: Font

  text: string = ""

  border?: string

  background?: string

  textAlign: CanvasTextAlign = "left"
  textBaseline: CanvasTextBaseline = "top"
  direction: CanvasDirection = "inherit"

  abstract renderText(ctx: CanvasRenderingContext2D): void
  abstract countTextBox(ctx: CanvasRenderingContext2D): void

  setTextStyles(ctx: CanvasRenderingContext2D) {
    const { font, textBaseline, textAlign, direction } = this
    ctx.textBaseline = textBaseline
    ctx.textAlign = textAlign
    if (typeof font === "string") {
      ctx.font = font
    } else {
      ctx.font = font.genFontValue()
    }
    ctx.direction = direction
  }

  renderBefore(ctx: CanvasRenderingContext2D) {
    super.renderBefore(ctx)
    this.setContextParam(ctx)
    this.setTextStyles(ctx)
  }

  renderBorderAndBackground(ctx: CanvasRenderingContext2D) {
    const { textBox, border, background } = this
    if (!textBox || (!border && !background)) return
    const { boxX, boxY, boxWidth, boxHeight } = textBox
    ctx.save()
    const shapeData: D_SHAPE = {
      type: "shape",
      d_path: {
        type: "rect",
        width: boxWidth,
        height: boxHeight,
        x: boxX,
        y: boxY
      },
      stroke: border || "rgba(0, 0, 0, 0)",
      fill: background || "rgba(0, 0, 0, 0)",
      strokeParam: {
        lineWidth: 1,
        lineCap: "square",
        lineJoin: "round",
        lineDashOffset: 0,
        lineDash: []
      }
    }
    ;(Shape.createObj(Shape, shapeData) as Shape).render(ctx)
    ctx.restore()
  }

  public countElementBox(ctx: CanvasRenderingContext2D): void {
    this.elementBox = this.textBox
  }
}

export class Text extends TextBase implements D_TEXT {
  public updateElementBox(box: Partial<Box>): void {
    throw new Error("Method not implemented.")
  }
  public readonly type = "text"

  ATTRIBUTE_NAMES: (keyof D_TEXT)[] = [...this.ATTRIBUTE_NAMES]

  countTextBox(ctx: CanvasRenderingContext2D) {
    const textMetrics = ctx.measureText(this.text)
    this.textBox = countTextBoxByTextMetrics(
      textMetrics,
      this.origin.toPoint(),
      this.font.fontSize,
      this.text
    )
  }

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.text) return
    ctx.save()
    this.renderBefore(ctx)
    this.countTextBox(ctx)
    this.renderBorderAndBackground(ctx)
    this.renderText(ctx)
    this.renderAfter(ctx)
    ctx.restore()
  }

  renderText(ctx: CanvasRenderingContext2D) {
    ctx.strokeText(this.text, this.origin.x, this.origin.y)
    ctx.fillText(this.text, this.origin.x, this.origin.y)
  }

  fromJSON(json: OmitType<D_TEXT>): void {
    super.fromJSON(json)
    const { font } = json
    this.font = Font.createObj(Font, font || {})
  }
}

export class Paragraph extends TextBase implements D_TEXT_BOX {
  // @ts-ignore
  ATTRIBUTE_NAMES: (keyof D_TEXT_BOX)[] = ["width", "height", ...this.ATTRIBUTE_NAMES]

  public readonly type = "paragraph"

  // FIXME: 改为 maxWidth
  width!: number

  // FIXME: 改为 minHeight
  height!: number

  get textLine() {
    return genTextLine(this.text)
  }

  textLineBox: TextBox[] = []

  tempBox?: Partial<Box>

  render(ctx: CanvasRenderingContext2D): void {
    if (!this.text) return
    ctx.save()
    this.renderBefore(ctx)
    if (this.updateText(ctx)) {
      ctx.restore()
      this.render(ctx)
      return
    }
    this.countTextBox(ctx)
    this.renderBorderAndBackground(ctx)
    this.renderText(ctx)
    this.renderAfter(ctx)
    ctx.restore()
  }

  updateText(ctx: CanvasRenderingContext2D) {
    const { textLine, text } = this
    updateText(textLine, ctx, this.width)
    this.text = textLine.join("")
    return text !== this.text
  }

  renderText(ctx: CanvasRenderingContext2D): void {
    const { textLine, textLineBox } = this
    for (let i = 0; i < textLineBox.length; i++) {
      const text = textLine[i]
      if (!text) return
      const box = textLineBox[i]
      const { x, y } = box

      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
    }
  }

  countTextBox(ctx: CanvasRenderingContext2D) {
    const { textLine, origin, textLineBox } = this
    let { x, y } = origin
    let textHeight
    for (let i = 0; i < textLine.length; i++) {
      const measure = ctx.measureText(textLine[i])
      const box = countTextBoxByTextMetrics(
        measure,
        new Point(x, y),
        this.font.fontSize,
        textLine[i]
      )
      textLineBox[i] = box
      y += box.boxHeight
    }

    this.textBox = addTextLineBox(textLineBox)
    if (this.textBox.boxHeight > this.height) this.height = this.textBox.boxHeight
  }

  public updateElementBox(box: Partial<Box>): void {
    const { boxX, boxY, boxWidth, boxHeight } = box
    const { origin } = this

    boxX && (origin.x = boxX)
    boxY && (origin.y = boxY)
    boxWidth && (this.width = boxWidth)
    boxHeight && (this.height = boxHeight)
  }

  public countElementBox(ctx: CanvasRenderingContext2D): void {
    super.countElementBox(ctx)
    const { elementBox, width, height } = this
    elementBox.boxWidth = width
    elementBox.boxHeight = height
  }

  fromJSON(json: OmitType<D_TEXT_BOX>): void {
    super.fromJSON(json)
    const { font } = json
    this.font = Font.createObj(Font, font || {})
  }
}

export class Font extends Attribute implements D_FONT {
  public type: string = "attr_font"

  ATTRIBUTE_NAMES: (keyof D_FONT)[] = [
    "fontFamily",
    "fontStyle",
    "fontVariant",
    "fontWeight",
    "fontSize",
    "lineHeight"
  ]

  fontFamily: string = "sans-serif"
  fontSize: number = 40
  fontStyle: string = "normal"
  fontVariant: string = "normal"
  fontWeight: string = "normal"
  lineHeight: number = 1.16

  /**
   * 字体样式
   *
   * font 构造规则:
   * 1. 必须包含 font-size 和 font-family
   * 2. font-family 必须最后指定
   * 3. font-style, font-variant 和 font-weight 必须在 font-size 之前
   * 4. 可以选择性包含 font-style font-variant font-weight line-height
   * 5. line-height 必须跟在 font-size 后面，由 "/" 分隔，例如 "16px/3"
   */
  genFontValue() {
    const { fontSize, fontFamily, fontStyle, fontVariant, fontWeight, lineHeight } = this
    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}px${
      lineHeight ? `/${lineHeight}` : ""
    } ${fontFamily}`
  }

  fromJSON(json: OmitType<D_FONT>): void {
    super.fromJSON(json)
  }
}
