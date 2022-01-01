import { Point } from "@canvas-2d/shared"
import { expect } from "chai"

import {
  firstLineIsEmpty,
  finalLineIsEmpty,
  oneLine,
  multiLine
} from "../../shared/__tests__/text.test"
import {
  countCaretIndexByCoord,
  countCaretPositionByCoord,
  countCaretCoordByIndex,
  countCaretCoordByPoint
} from "../src/caret-util"

describe("caret", () => {
  context("countCaretIndexByCoord 通过坐标计算索引", () => {
    it("首行为空", () => {
      expect(countCaretIndexByCoord(firstLineIsEmpty, 0, 0)).to.be.eq(0)
      expect(() => countCaretIndexByCoord(firstLineIsEmpty, 0, 1)).to.throw()
    })

    it("尾行为空", () => {
      expect(countCaretIndexByCoord(finalLineIsEmpty, 0, 0)).to.be.eq(0)
      expect(countCaretIndexByCoord(finalLineIsEmpty, 0, 1)).to.be.eq(1)
      expect(countCaretIndexByCoord(finalLineIsEmpty, 0, 2)).to.be.eq(2)
      expect(countCaretIndexByCoord(finalLineIsEmpty, 1, 0)).to.be.eq(3)
      expect(() => countCaretIndexByCoord(finalLineIsEmpty, 1, 1)).to.throw()
    })

    it("只有一行", () => {
      expect(countCaretIndexByCoord(oneLine, 0, 0)).to.be.eq(0)
      expect(countCaretIndexByCoord(oneLine, 0, 1)).to.be.eq(1)
      expect(countCaretIndexByCoord(oneLine, 0, 2)).to.be.eq(2)
      expect(() => countCaretIndexByCoord(oneLine, 0, 3)).to.throw()
    })

    it("多行", () => {
      expect(countCaretIndexByCoord(multiLine, 0, 0)).to.be.eq(0)
      expect(countCaretIndexByCoord(multiLine, 0, 1)).to.be.eq(1)
      expect(countCaretIndexByCoord(multiLine, 0, 2)).to.be.eq(2)
      expect(countCaretIndexByCoord(multiLine, 0, 4)).to.be.eq(4)
      expect(countCaretIndexByCoord(multiLine, 1, 0)).to.be.eq(5)
      expect(countCaretIndexByCoord(multiLine, 1, 2)).to.be.eq(7)
      expect(countCaretIndexByCoord(multiLine, 2, 0)).to.be.eq(8)
      expect(countCaretIndexByCoord(multiLine, 2, 2)).to.be.eq(10)
      expect(() => countCaretIndexByCoord(multiLine, 2, 3)).to.throw()
    })
  })

  context("countCaretPositionByCoord 通过位置计算坐标", () => {
    const origin = new Point(10, 10)

    it("首行为空", () => {
      expect(countCaretPositionByCoord(firstLineIsEmpty, 0, 0, origin)).to.deep.eq(origin)
      expect(() => countCaretPositionByCoord(firstLineIsEmpty, 0, 1, origin)).to.throw()
    })

    it("尾行为空", () => {
      expect(countCaretPositionByCoord(finalLineIsEmpty, 0, 0, origin)).to.deep.eq(
        new Point(finalLineIsEmpty[0][0].boxX, finalLineIsEmpty[0][0].boxY)
      )
      expect(countCaretPositionByCoord(finalLineIsEmpty, 0, 1, origin)).to.deep.eq(
        new Point(finalLineIsEmpty[0][1].boxX, finalLineIsEmpty[0][1].boxY)
      )
      expect(countCaretPositionByCoord(finalLineIsEmpty, 0, 2, origin)).to.deep.eq(
        new Point(finalLineIsEmpty[0][2].boxX, finalLineIsEmpty[0][2].boxY)
      )
      expect(countCaretPositionByCoord(finalLineIsEmpty, 1, 0, origin)).to.deep.eq(
        new Point(
          finalLineIsEmpty[0][0].boxX,
          finalLineIsEmpty[0][0].boxY + finalLineIsEmpty[0][0].boxHeight
        )
      )
      expect(() => countCaretPositionByCoord(finalLineIsEmpty, 1, 1, origin)).to.throw()
    })

    it("只有一行", () => {
      expect(countCaretPositionByCoord(oneLine, 0, 0, origin)).to.deep.eq(
        new Point(oneLine[0][0].boxX, oneLine[0][0].boxY)
      )
      expect(countCaretPositionByCoord(oneLine, 0, 1, origin)).to.deep.eq(
        new Point(oneLine[0][1].boxX, oneLine[0][1].boxY)
      )
      expect(countCaretPositionByCoord(oneLine, 0, 2, origin)).to.deep.eq(
        new Point(oneLine[0][1].boxX + oneLine[0][1].boxWidth, oneLine[0][1].boxY)
      )
      expect(() => countCaretPositionByCoord(oneLine, 0, 3, origin)).to.throw()
    })

    it("多行", () => {
      expect(countCaretPositionByCoord(multiLine, 0, 0, origin)).to.deep.eq(
        new Point(multiLine[0][0].boxX, multiLine[0][0].boxY)
      )
      expect(countCaretPositionByCoord(multiLine, 0, 1, origin)).to.deep.eq(
        new Point(multiLine[0][1].boxX, multiLine[0][1].boxY)
      )
      expect(countCaretPositionByCoord(multiLine, 0, 2, origin)).to.deep.eq(
        new Point(multiLine[0][2].boxX, multiLine[0][2].boxY)
      )
      expect(countCaretPositionByCoord(multiLine, 0, 4, origin)).to.deep.eq(
        new Point(multiLine[0][4].boxX, multiLine[0][4].boxY)
      )
      expect(countCaretPositionByCoord(multiLine, 1, 0, origin)).to.deep.eq(
        new Point(multiLine[1][0].boxX, multiLine[1][0].boxY)
      )
      expect(countCaretPositionByCoord(multiLine, 1, 2, origin)).to.deep.eq(
        new Point(multiLine[1][2].boxX, multiLine[1][2].boxY)
      )
      expect(countCaretPositionByCoord(multiLine, 2, 0, origin)).to.deep.eq(
        new Point(multiLine[2][0].boxX, multiLine[2][0].boxY)
      )
      expect(countCaretPositionByCoord(multiLine, 2, 2, origin)).to.deep.eq(
        new Point(multiLine[2][1].boxX + multiLine[2][1].boxWidth, multiLine[2][1].boxY)
      )
      expect(() => countCaretPositionByCoord(multiLine, 2, 3, origin)).to.throw()
    })
  })

  context("countCaretCoordByIndex 通过索引计算坐标", () => {
    it("首行为空", () => {
      expect(countCaretCoordByIndex(firstLineIsEmpty, 0)).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(() => countCaretCoordByIndex(firstLineIsEmpty, 1)).to.throw()
    })

    it("尾行为空", () => {
      expect(countCaretCoordByIndex(finalLineIsEmpty, 0)).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByIndex(finalLineIsEmpty, 1)).to.deep.eq({
        caretRow: 0,
        caretColumn: 1
      })
      expect(countCaretCoordByIndex(finalLineIsEmpty, 2)).to.deep.eq({
        caretRow: 0,
        caretColumn: 2
      })
      expect(countCaretCoordByIndex(finalLineIsEmpty, 3)).to.deep.eq({
        caretRow: 1,
        caretColumn: 0
      })
      expect(() => countCaretCoordByIndex(finalLineIsEmpty, 4)).to.throw()
    })

    it("只有一行", () => {
      expect(countCaretCoordByIndex(oneLine, 0)).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByIndex(oneLine, 1)).to.deep.eq({
        caretRow: 0,
        caretColumn: 1
      })
      expect(countCaretCoordByIndex(oneLine, 2)).to.deep.eq({
        caretRow: 0,
        caretColumn: 2
      })
      expect(() => countCaretCoordByIndex(oneLine, 3)).to.throw()
    })

    it("多行", () => {
      expect(countCaretCoordByIndex(multiLine, 0)).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByIndex(multiLine, 1)).to.deep.eq({
        caretRow: 0,
        caretColumn: 1
      })
      expect(countCaretCoordByIndex(multiLine, 2)).to.deep.eq({
        caretRow: 0,
        caretColumn: 2
      })
      expect(countCaretCoordByIndex(multiLine, 4)).to.deep.eq({
        caretRow: 0,
        caretColumn: 4
      })
      expect(countCaretCoordByIndex(multiLine, 5)).to.deep.eq({
        caretRow: 1,
        caretColumn: 0
      })
      expect(countCaretCoordByIndex(multiLine, 7)).to.deep.eq({
        caretRow: 1,
        caretColumn: 2
      })
      expect(countCaretCoordByIndex(multiLine, 8)).to.deep.eq({
        caretRow: 2,
        caretColumn: 0
      })
      expect(countCaretCoordByIndex(multiLine, 10)).to.deep.eq({
        caretRow: 2,
        caretColumn: 2
      })
      expect(() => countCaretCoordByIndex(multiLine, 11)).to.throw()
    })
  })

  context("countCaretCoordByPoint 通过点击位置计算相邻的坐标位置", () => {
    it("首行为空", () => {
      expect(countCaretCoordByPoint(firstLineIsEmpty, new Point(0, 0))).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByPoint(firstLineIsEmpty, new Point(1000, 1000))).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByPoint(firstLineIsEmpty, new Point(20, 1000))).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByPoint(firstLineIsEmpty, new Point(1000, 20))).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
    })

    it("尾行为空", () => {
      expect(countCaretCoordByPoint(finalLineIsEmpty, new Point(0, 0))).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByPoint(finalLineIsEmpty, new Point(1000, 20))).to.deep.eq({
        caretRow: 0,
        caretColumn: 2
      })
      expect(countCaretCoordByPoint(finalLineIsEmpty, new Point(25, 20))).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByPoint(finalLineIsEmpty, new Point(45, 20))).to.deep.eq({
        caretRow: 0,
        caretColumn: 1
      })
      expect(countCaretCoordByPoint(finalLineIsEmpty, new Point(1000, 1000))).to.deep.eq({
        caretRow: 1,
        caretColumn: 0
      })
    })

    it("只有一行", () => {
      expect(countCaretCoordByPoint(oneLine, new Point(0, 0))).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByPoint(oneLine, new Point(1000, 20))).to.deep.eq({
        caretRow: 0,
        caretColumn: 2
      })
      expect(countCaretCoordByPoint(oneLine, new Point(25, 20))).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByPoint(oneLine, new Point(45, 20))).to.deep.eq({
        caretRow: 0,
        caretColumn: 1
      })
      expect(countCaretCoordByPoint(oneLine, new Point(1000, 1000))).to.deep.eq({
        caretRow: 0,
        caretColumn: 2
      })
    })

    it("多行", () => {
      expect(countCaretCoordByPoint(multiLine, new Point(0, 20))).to.deep.eq({
        caretRow: 0,
        caretColumn: 0
      })
      expect(countCaretCoordByPoint(multiLine, new Point(1000, 20))).to.deep.eq({
        caretRow: 0,
        caretColumn: 4
      })
      expect(countCaretCoordByPoint(multiLine, new Point(1000, 1000))).to.deep.eq({
        caretRow: 2,
        caretColumn: 2
      })
    })
  })
})
