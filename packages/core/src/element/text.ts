import {
  genTextLine,
  TextBox,
  countTextBoxByTextMetrics,
  addTextLineBox,
  updateText,
  Point,
  Box,
  assertJsonType,
  assetValueRange
} from "@canvas-2d/shared"

import { Element } from "./_element"
import { Font } from "../attr"
import { TextType, D_TEXT, D_TEXT_BOX, D_TEXT_BASE, OmitType } from "../type"
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

  font: Font = new Font()

  text: string = ""

  border: string = "rgba(0, 0, 0, 0)"

  background: string = "rgba(0, 0, 0, 0)"

  static textAlign = ["center", "end", "left", "right", "start"]

  textAlign: CanvasTextAlign = "left"

  static textBaseline = ["alphabetic", "bottom", "hanging", "ideographic", "middle", "top"]

  textBaseline: CanvasTextBaseline = "top"

  static direction = ["inherit", "ltr", "rtl"]

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

  static assertJsonTrue(json?: OmitType<D_TEXT_BASE>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { font, text, textAlign, textBaseline, direction, border, background } = json
    Font.assertJsonTrue(font)
    assertJsonType(text, "string")
    assertJsonType(background, "string")
    assertJsonType(border, "string")
    assetValueRange(textBaseline, TextBase.textBaseline)
    assetValueRange(textAlign, TextBase.textAlign)
    assetValueRange(direction, TextBase.direction)
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

  static assertJsonTrue(json?: OmitType<D_TEXT>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
  }

  fromJSON(json: OmitType<D_TEXT>): void {
    super.fromJSON(json)
    const { font } = json
    font && this.font.fromJSON(font)
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

  static assertJsonTrue(json?: OmitType<D_TEXT_BOX>) {
    if (json === undefined) return
    super.assertJsonTrue(json)
    const { width, height } = json
    assertJsonType(width, "number")
    assertJsonType(height, "number")
  }

  fromJSON(json: OmitType<D_TEXT_BOX>): void {
    super.fromJSON(json)
    const { font } = json
    font && this.font.fromJSON(font)
  }
}
