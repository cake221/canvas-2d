import {
  CanvasBase,
  CanvasBaseParam,
  genTextChar,
  TextBox,
  countTextBoxByTextMetrics,
  Point
} from "@canvas-2d/shared"
import { Paragraph } from "@canvas-2d/core"

import {
  countCaretIndexByCoord,
  CaretData,
  countCaretByPoint,
  countCaretCoordByIndex,
  countCaretPositionByCoord
} from "./caret-util"
import { HiddenInput } from "./hiddenInput"
import { Caret } from "./caret"
import { Selection } from "./selection"

interface CanvasInputParam extends CanvasBaseParam {
  paragraph?: Paragraph
  renderCallBack?: () => void
  elementBlurCallback?: (ev: PointerEvent) => void
}

export interface OnValueHandle {
  (value: string): void
}

export class CanvasInput extends CanvasBase {
  paragraph: Paragraph | null = null

  get origin() {
    const { origin } = this.paragraph!
    return new Point(origin.x, origin.y)
  }

  get defaultBoxHeight() {
    return this.paragraph!.font.fontSize
  }

  get textLength() {
    return this.text.length
  }

  get text() {
    return this.paragraph!.text
  }

  set text(txt: string) {
    this.paragraph!.text = txt
  }

  get textChar() {
    return genTextChar(this.text)
  }

  __debug = false

  hiddenInput!: HiddenInput

  caret!: Caret

  selection!: Selection

  lenAfterCaret = 0 // 光标后面的字符

  lenBeforeCaretStart = 0 // 选区的起始索引

  lenBeforeCaretEnd = 0 // 选区的结束索引

  caretTime?: NodeJS.Timeout

  textCharBox: TextBox[][] = [[]]

  renderCallBack = () => {}

  elementBlurCallback = (ev: PointerEvent) => {}

  constructor(param: CanvasInputParam) {
    super(param)

    const { paragraph, renderCallBack, elementBlurCallback } = param

    paragraph && this.setParagraph(paragraph)

    renderCallBack && (this.renderCallBack = renderCallBack)

    elementBlurCallback && (this.elementBlurCallback = elementBlurCallback)
  }

  setParagraph(paragraph: Paragraph) {
    paragraph && (this.paragraph = paragraph)

    this.caret = new Caret(this.origin.x, this.origin.y, this.defaultBoxHeight)

    this.hiddenInput = new HiddenInput(this.text)

    this.selection = new Selection()

    this.hiddenInput.onNewValue(this.onNewValue)

    this.hiddenInput.onKeydown(this.onKeydown)

    this.render()
  }

  removeParagraph() {
    this.cancelCaretTwinkle()
    this.hiddenInput.blur()
    this.paragraph = null
    this.clear()
  }

  cancelCaretTwinkle() {
    clearTimeout(this.caretTime!)
    this.caret.cancelTwinkle(this.ctx)
  }

  startCaretTwinkle() {
    this.cancelCaretTwinkle()
    this.caretTime = setTimeout(() => {
      this.renderStatic()
      this.caret.startTwinkle(this.ctx)
    }, 1500)
  }

  onPointerdown(ev: PointerEvent) {
    super.onPointerdown(ev)
    if (!this.paragraph) return
    const { textCharBox, paragraph } = this
    const p = this.dom2CanvasPoint(ev.pageX, ev.pageY)
    if (!paragraph.elementBox.isPointInFrame(p, paragraph.rotate)) {
      this.submit(ev)
      return
    }

    this.startCaretTwinkle()
    this.selection.active = true
    const caret = countCaretByPoint(textCharBox, p, this.origin)
    this.lenBeforeCaretStart = caret.index
    this.lenBeforeCaretEnd = caret.index
    this.updateLenAfterCaret(caret)
    this.render()
  }

  onPointermove(ev: PointerEvent) {
    super.onPointermove(ev)
    if (!this.paragraph) return
    const { textCharBox } = this

    if (!this.selection.active) return
    const p = this.dom2CanvasPoint(ev.pageX, ev.pageY)
    const caret = countCaretByPoint(textCharBox, p, this.origin)
    this.lenBeforeCaretEnd = caret.index
    if (this.lenBeforeCaretEnd === this.lenBeforeCaretStart) return
    this.cancelCaretTwinkle()
    this.renderStatic()
  }

  onPointerup(ev: PointerEvent) {
    super.onPointerup(ev)
    if (!this.paragraph) return
    this.selection.active = false
    this.hiddenInput.focus()
  }

  updateLenAfterCaret(caret: CaretData) {
    const { textLength } = this
    const { index, coord } = caret
    this.lenAfterCaret = textLength - index
    this.renderCaretByCoord(coord.caretRow, coord.caretColumn)

    if (this.__debug) {
      console.log(
        "光标的点击位置是",
        coord,
        index,
        this.lenAfterCaret,
        this.textLength - this.lenAfterCaret
      )
    }
  }

  submit(ev: PointerEvent) {
    this.elementBlurCallback(ev)
    if (!this.paragraph) return
    this.render()
  }

  onKeydown: OnValueHandle = (value: string) => {
    const { lenAfterCaret } = this
    if (!this.hiddenInput.isCtrlValue(value)) return
    switch (value) {
      case "ArrowLeft":
        if (lenAfterCaret >= this.textLength) return
        this.lenAfterCaret++
        break
      case "ArrowRight":
        if (lenAfterCaret <= 0) return
        this.lenAfterCaret--
        break
      case "ArrowUp":
      case "ArrowDown":
        this.onArrowUpDown(value === "ArrowUp" ? "ArrowUp" : "ArrowDown")
      default:
    }

    this.render()
  }

  onArrowUpDown(type: "ArrowUp" | "ArrowDown") {
    // FIXME: 英文符号光标上下有问题，不能根据字符的个数决定
    const { textLength, textCharBox, lenAfterCaret } = this
    const coord = countCaretCoordByIndex(textCharBox, textLength - lenAfterCaret)
    let { caretRow, caretColumn } = coord
    if (type === "ArrowDown") {
      /**
       * 1. 如果在尾行行，定位到最后一个光标
       * 2. 如果在其他行，向上如果没有元素
       * 2.1 在该行的最后一个元素
       */
      if (caretRow === textCharBox.length - 1) {
        caretColumn = textCharBox[caretRow].length - 1
      } else if (textCharBox[caretRow].length - 1 === caretColumn) {
        // 光标在该行的最后一个光标，向下
        if (caretRow + 1 === textCharBox.length - 1) {
          // 最后一行
          this.lenAfterCaret = 0
          return
        }
        caretColumn = textCharBox[caretRow + 1].length - 1
        caretRow++
      } else if (textCharBox[caretRow + 1]?.[caretColumn]) {
        caretRow++
      } else {
        caretColumn = textCharBox[caretRow + 1].length - 1
        caretRow++
      }
    } else {
      /**
       * 1. 如果在首行，定位到第一个光标
       * 2. 如果在其他行，向上如果没有元素，则定位到该行的最后一个元素
       */
      if (caretRow === 0) {
        caretColumn = 0
      } else if (textCharBox[caretRow - 1]?.[caretColumn]) {
        caretRow--
      } else {
        caretRow--
        caretColumn = textCharBox[caretRow].length - 1
      }
    }

    const index = countCaretIndexByCoord(textCharBox, caretRow, caretColumn)
    this.lenAfterCaret = textLength - index
  }

  onNewValue: OnValueHandle = (value) => {
    this.text = value
    this.render()
  }

  updateCaretByAfterIndex() {
    const { textLength, lenAfterCaret, textCharBox } = this
    const caretIndex = textLength - lenAfterCaret
    const caretCoord = countCaretCoordByIndex(textCharBox, caretIndex)
    this.renderCaretByCoord(caretCoord.caretRow, caretCoord.caretColumn)
  }

  renderCaretByCoord(caretRow: number, caretColumn: number) {
    const { textCharBox, origin, textLength, lenAfterCaret } = this
    const position = countCaretPositionByCoord(textCharBox, caretRow, caretColumn, origin)

    this.caret.x = position.x
    this.caret.y = position.y

    this.caret.showCaret(this.ctx)

    setTimeout(() => {
      this.hiddenInput.updateInputCaret(textLength - lenAfterCaret)
    })

    if (this.__debug) {
      this.drawPoint(position.x, position.y)
    }
  }

  countTextBox() {
    const { ctx, textChar, origin, defaultBoxHeight } = this
    if (!this.paragraph) return
    let { x, y } = origin
    const textCharBox = []
    ctx.save()
    this.paragraph.renderBefore(ctx)
    for (let i = 0; i < textChar.length; i++) {
      const line = textChar[i]
      const textLineBox = []
      x = origin.x
      let lineHeight = Number.MIN_VALUE
      for (let j = 0; j < line.length; j++) {
        const char = line[j]
        const box = countTextBoxByTextMetrics(
          ctx.measureText(char),
          new Point(x, y),
          defaultBoxHeight,
          char
        )
        textLineBox[j] = box
        this.__debug && this.drawPoint(box.x, box.y)
        this.__debug && this.drawPoint(box.boxX, box.boxY, "rgba(0, 0, 255, .3)")
        x += box.boxWidth
        lineHeight = Math.max(lineHeight, box.boxHeight)
      }
      y += lineHeight
      textCharBox[i] = textLineBox
    }
    this.textCharBox = textCharBox
    if (this.__debug) {
      console.log("检测数据", this.textChar, this.textCharBox)
    }
    ctx.restore()
  }

  renderContent() {
    const { ctx, text, paragraph } = this
    if (!paragraph) return
    paragraph.text = text
    paragraph.elementBox.render(ctx, {
      stroke: "red",
      fill: "white"
    })
    paragraph.render(ctx)
    this.hiddenInput.hiddenInput.value = this.text
  }

  updateSelection() {
    const { ctx, lenBeforeCaretStart, lenBeforeCaretEnd, selection, textCharBox } = this
    if (lenBeforeCaretStart === lenBeforeCaretEnd) return
    const startBoxIndex =
      lenBeforeCaretStart > lenBeforeCaretEnd ? lenBeforeCaretEnd : lenBeforeCaretStart
    const endBoxIndex =
      lenBeforeCaretStart > lenBeforeCaretEnd ? lenBeforeCaretStart : lenBeforeCaretEnd
    this.hiddenInput.updateInputSelection(startBoxIndex, endBoxIndex)
    selection.showSelection(ctx, textCharBox, startBoxIndex, endBoxIndex)
  }

  renderStatic() {
    this.clear()
    this.renderContent()
    this.countTextBox()
    this.updateSelection()
  }

  render() {
    this.renderStatic()
    this.updateCaretByAfterIndex()
    this.renderCallBack()
  }
}
