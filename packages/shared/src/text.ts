import { Point, Box } from "./point"
import { parseJsonData } from "./utils"

export function genTextLine(text: string) {
  const textLine = text.split(/\n/).map((str) => str + "\n")
  const finalLine = textLine.pop()!
  textLine.push(finalLine.substring(0, finalLine.length - 1))

  return textLine
}

export function genTextChar(text: string) {
  const textLine = genTextLine(text)
  return textLine.map((str) => str.split(""))
}

export function textFromCharBoxs(textCharBoxs: TextBox[][]) {
  let text = ""
  for (let i = 0; i < textCharBoxs.length; i++) {
    const line = textCharBoxs[i]
    for (let j = 0; j < line.length; j++) {
      text += line[j].char
    }
  }
  return text
}

export function textCharFromTextBox(textCharBoxs: TextBox[][]): string[][] {
  const textChar = []
  for (let i = 0; i < textCharBoxs.length; i++) {
    const line = textCharBoxs[i]
    const lineChar = []
    for (let j = 0; j < line.length; j++) {
      lineChar[j] = line[j].char
    }
    textChar[i] = lineChar
  }
  return textChar
}

export class TextBox extends Box {
  x: number = 0
  y: number = 0

  char: string = ""

  static from(json: Partial<TextBox>): TextBox {
    const textBox = new TextBox()
    parseJsonData(textBox, json)
    return textBox
  }
}

// TODO: boxX 和 boxY 计算的值不准确。暂时用 x,y 代替
export function countTextBoxByTextMetrics(
  textMetrics: TextMetrics,
  origin: Point,
  fontSize: number,
  char: string
): TextBox {
  const height = fontSize * 1.23 // 高度修正
  const { width } = textMetrics
  return TextBox.from({
    x: origin.x,
    y: origin.y,
    boxX: origin.x, // origin.x + actualBoundingBoxLeft,
    boxY: origin.y, // origin.y + actualBoundingBoxAscent,
    boxWidth: width,
    boxHeight: height, // Math.max(height, actualBoundingBoxDescent - actualBoundingBoxAscent)
    char
  })
}

export function addTextLineBox(textLineBoxs: TextBox[]): TextBox {
  let boxHeight = 0
  let boxX = Number.MAX_VALUE
  let boxWidth = Number.MIN_VALUE

  for (let i = 0; i < textLineBoxs.length; i++) {
    boxHeight += textLineBoxs[i].boxHeight
    boxX = Math.min(boxX, textLineBoxs[i].boxX)
    boxWidth = Math.max(boxWidth, textLineBoxs[i].boxWidth)
  }

  return TextBox.from({
    ...textLineBoxs[0],
    boxX,
    boxWidth,
    boxHeight
  })
}

export function updateText(textLine: string[], ctx: CanvasRenderingContext2D, maxWidth: number) {
  for (let i = 0; i < textLine.length; i++) {
    const line = textLine[i]
    const { width } = ctx.measureText(line)
    if (width > maxWidth) {
      let newLine = ""
      for (let j = 0; j < line.length; j++) {
        if (line[j] === "\n") continue
        newLine += line[j]
        const { width } = ctx.measureText(newLine + (line[j + 1] || "") + "\n")
        if (width > maxWidth) {
          textLine.splice(i, 0, newLine + "\n")
          textLine[i + 1] = line.slice(j + 1)
          i++
          newLine = ""
        }
      }
    }
  }
}
