import { invariant, Point, TextBox } from "@canvas-2d/shared"

export interface CaretCoord {
  caretRow: number
  caretColumn: number
}

export interface CaretData {
  coord: CaretCoord
  position: Point
  index: number
}

export function countCaretCoordByPoint(textCharBoxs: TextBox[][], point: Point): CaretCoord {
  const { x, y } = point
  let [caretRow, caretColumn] = [0, 0] // caretRow 行 caretColumn 列
  for (; caretRow + 1 < textCharBoxs.length; caretRow++) {
    const firstLineBox = textCharBoxs[caretRow][0]
    if (firstLineBox.boxY + firstLineBox.boxHeight > y) break
  }
  const line = textCharBoxs[caretRow]
  if (!line.length) {
    // 尾行为空
    return {
      caretRow,
      caretColumn
    }
  }
  for (; caretColumn < line.length; caretColumn++) {
    const charBox = textCharBoxs[caretRow][caretColumn]
    if (charBox.boxX + charBox.boxWidth > x) {
      return {
        caretRow,
        caretColumn
      }
    }
  }

  return {
    caretRow,
    caretColumn: caretRow === textCharBoxs.length - 1 ? caretColumn : caretColumn - 1
  }
}

export function countCaretIndexByCoord(
  textCharBoxs: TextBox[][],
  caretRow: number,
  caretColumn: number
): number {
  assertCaretCoord(textCharBoxs, { caretRow, caretColumn })
  let index = 0
  let [i, j] = [0, 0]
  for (i = 0; i < textCharBoxs.length; i++) {
    const lineBoxs = textCharBoxs[i]
    for (j = 0; j < lineBoxs.length; j++) {
      if (i === caretRow && j === caretColumn) {
        return index
      }
      index++
    }
  }

  return index
}

function assertCaretCoord(textCharBoxs: TextBox[][], coord: CaretCoord) {
  const { caretRow, caretColumn } = coord
  if (coordIsEnd(textCharBoxs, caretRow, caretColumn)) return
  if (textCharBoxs[caretRow]?.[caretColumn]) return
  throw new Error("caret 的坐标超出的范围")
}

export function coordIsEnd(
  textCharBoxs: TextBox[][],
  caretRow: number,
  caretColumn: number
): boolean {
  const finalRow = textCharBoxs.length - 1
  const finalColumn = (textCharBoxs[finalRow]?.length || 0) - 1

  return caretRow === finalRow && caretColumn === finalColumn + 1
}

export function countCaretPositionByCoord(
  textCharBoxs: TextBox[][],
  caretRow: number,
  caretColumn: number,
  origin: Point
): Point {
  assertCaretCoord(textCharBoxs, { caretRow, caretColumn })
  if (!coordIsEnd(textCharBoxs, caretRow, caretColumn)) {
    return {
      x: textCharBoxs[caretRow][caretColumn].boxX,
      y: textCharBoxs[caretRow][caretColumn].boxY
    }
  }

  const finalBox = textCharBoxs[caretRow]?.[caretColumn - 1] // 尾行是否为空
  if (finalBox) {
    // 尾行不为空，根据最后一个box计算
    return {
      x: finalBox.boxX + finalBox.boxWidth,
      y: finalBox.boxY
    }
  } else {
    // 尾行为空，根据上一行计算
    return {
      x: origin.x,
      y:
        textCharBoxs[caretRow - 1]?.[0].boxY + textCharBoxs[caretRow - 1]?.[0].boxHeight || origin.y
    }
  }
}

export function countCaretCoordByIndex(textCharBoxs: TextBox[][], index: number): CaretCoord {
  let count = 0
  let [i, j] = [0, 0]

  for (i = 0; i < textCharBoxs.length; i++) {
    const lineBoxs = textCharBoxs[i]
    for (j = 0; j < lineBoxs.length; j++) {
      if (count === index) {
        return {
          caretRow: i,
          caretColumn: j
        }
      }
      count++
    }
  }
  invariant(index === count, "索引值有问题")
  return {
    caretRow: i - 1,
    caretColumn: j
  }
}

export function countCaretByPoint(
  textCharBoxs: TextBox[][],
  point: Point,
  origin: Point
): CaretData {
  const coord = countCaretCoordByPoint(textCharBoxs, point)
  const index = countCaretIndexByCoord(textCharBoxs, coord.caretRow, coord.caretColumn)
  const position = countCaretPositionByCoord(
    textCharBoxs,
    coord.caretRow,
    coord.caretColumn,
    origin
  )
  return {
    coord,
    position,
    index
  }
}
