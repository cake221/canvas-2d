import {
  CanvasBase,
  CanvasBaseParam,
  genTextChar,
  TextBox,
  countTextBoxByTextMetrics,
  Point
} from "@canvas-2d/shared"
import { Paragraph, D_TEXT_BOX } from "@canvas-2d/core"

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

interface CanvasInputParam extends CanvasBaseParam {}

export interface OnValueHandle {
  (value: string): void
}

const text_box_json: D_TEXT_BOX = {
  type: "paragraph",
  text: "",
  fill: "black"
}

export class CanvasInput extends CanvasBase {
  origin = new Point(10, 10)

  paragraph: Paragraph = Paragraph.createObj(Paragraph, { ...text_box_json, origin: this.origin })

  get defaultBoxHeight() {
    return this.paragraph.font.fontSize
  }

  get textLength() {
    return this.text.length
  }

  hiddenInput: HiddenInput = new HiddenInput()

  caret: Caret = new Caret(this.origin.x, this.origin.y, this.defaultBoxHeight)

  selection: Selection = new Selection()

  lenAfterCaret = 0 // 光标后面的字符

  lenBeforeCaretStart = 0 // 选区的起始索引

  lenBeforeCaretEnd = 0 // 选区的结束索引

  caretTime?: NodeJS.Timeout

  text: string = ""

  __debug = false

  get textChar() {
    return genTextChar(this.text)
  }

  textCharBox: TextBox[][] = [[]]

  constructor(param: CanvasInputParam) {
    super(param)

    this.canvas.addEventListener("pointerdown", this.onPointerdown)

    this.canvas.addEventListener("pointermove", this.onPointermove)

    this.canvas.addEventListener("pointerup", this.onPointerup)

    document.addEventListener("click", this.documentOnclick)

    this.hiddenInput.onNewValue(this.onNewValue)

    this.hiddenInput.onKeydown(this.onKeydown)

    this.preRender()
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

  documentOnclick = () => {
    this.submit()
    this.hiddenInput.blur()
  }

  onPointerdown = (ev: PointerEvent) => {
    const { textCharBox } = this
    this.startCaretTwinkle()
    this.selection.active = true
    const p = this.dom2CanvasPoint(ev.pageX, ev.pageY)
    const caret = countCaretByPoint(textCharBox, p, this.origin)
    this.lenBeforeCaretStart = caret.index
    this.lenBeforeCaretEnd = caret.index
    this.updateLenAfterCaret(caret)
    this.render()
  }

  onPointermove = (ev: PointerEvent) => {
    const { textCharBox } = this

    if (!this.selection.active) return
    const p = this.dom2CanvasPoint(ev.pageX, ev.pageY)
    const caret = countCaretByPoint(textCharBox, p, this.origin)
    this.lenBeforeCaretEnd = caret.index
    if (this.lenBeforeCaretEnd === this.lenBeforeCaretStart) return
    this.cancelCaretTwinkle()
    this.renderStatic()
  }

  onPointerup = () => {
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

  preRender() {
    this.setBackground("white")
  }

  submit() {
    this.caret.clear(this.ctx)
    if (!this.text) return
    console.log("数据提交", this.text)
    this.text = ""
    this.lenAfterCaret = 0
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
    paragraph.text = text
    paragraph.render(ctx)
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
    this.preRender()
    this.renderContent()
    this.countTextBox()
    this.updateSelection()
  }

  render() {
    this.renderStatic()
    this.updateCaretByAfterIndex()
  }
}
