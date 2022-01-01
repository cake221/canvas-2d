import { expect } from "chai"
import { textFromCharBoxs, genTextChar, textCharFromTextBox } from "../src/text"

// 首行为空
export const firstLineIsEmpty = [[]]
export const firstLineIsEmptyText = ""

// 尾行为空
export const finalLineIsEmpty = [
  [
    {
      x: 10,
      y: 10,
      boxX: 10,
      boxY: 10,
      boxWidth: 22.3599853515625,
      boxHeight: 49.2,
      char: "a"
    },
    {
      x: 32.3599853515625,
      y: 10,
      boxX: 32.3599853515625,
      boxY: 10,
      boxWidth: 40,
      boxHeight: 49.2,
      char: "你"
    },
    {
      x: 72.3599853515625,
      y: 10,
      boxX: 72.3599853515625,
      boxY: 10,
      boxWidth: 13.319992065429688,
      boxHeight: 49.2,
      char: "\n"
    }
  ],
  []
]
export const finalLineIsEmptyText = "a你\n"

// 只有一行
export const oneLine = [
  [
    {
      x: 10,
      y: 10,
      boxX: 10,
      boxY: 10,
      boxWidth: 24,
      boxHeight: 49.2,
      char: "0"
    },
    {
      x: 34,
      y: 10,
      boxX: 34,
      boxY: 10,
      boxWidth: 16.039993286132812,
      boxHeight: 49.2,
      char: "1"
    }
  ]
]
export const oneLineText = "01"

// 多行
export const multiLine = [
  [
    {
      x: 10,
      y: 10,
      boxX: 10,
      boxY: 10,
      boxWidth: 24,
      boxHeight: 49.2,
      char: "0"
    },
    {
      x: 34,
      y: 10,
      boxX: 34,
      boxY: 10,
      boxWidth: 16.039993286132812,
      boxHeight: 49.2,
      char: "1"
    },
    {
      x: 50.03999328613281,
      y: 10,
      boxX: 50.03999328613281,
      boxY: 10,
      boxWidth: 24,
      boxHeight: 49.2,
      char: "2"
    },
    {
      x: 74.03999328613281,
      y: 10,
      boxX: 74.03999328613281,
      boxY: 10,
      boxWidth: 24,
      boxHeight: 49.2,
      char: "3"
    },
    {
      x: 98.03999328613281,
      y: 10,
      boxX: 98.03999328613281,
      boxY: 10,
      boxWidth: 13.319992065429688,
      boxHeight: 49.2,
      char: "\n"
    }
  ],
  [
    {
      x: 10,
      y: 59.2,
      boxX: 10,
      boxY: 59.2,
      boxWidth: 24,
      boxHeight: 49.2,
      char: "5"
    },
    {
      x: 34,
      y: 59.2,
      boxX: 34,
      boxY: 59.2,
      boxWidth: 24,
      boxHeight: 49.2,
      char: "6"
    },
    {
      x: 58,
      y: 59.2,
      boxX: 58,
      boxY: 59.2,
      boxWidth: 13.319992065429688,
      boxHeight: 49.2,
      char: "\n"
    }
  ],
  [
    {
      x: 10,
      y: 108.4,
      boxX: 10,
      boxY: 108.4,
      boxWidth: 24,
      boxHeight: 49.2,
      char: "8"
    },
    {
      x: 34,
      y: 108.4,
      boxX: 34,
      boxY: 108.4,
      boxWidth: 24,
      boxHeight: 49.2,
      char: "9"
    }
  ]
]
export const multiLineText = "0123\n56\n89"

describe("caret", () => {
  it("textFromCharBoxs", () => {
    expect(textFromCharBoxs(firstLineIsEmpty)).to.equal(firstLineIsEmptyText)
    expect(textFromCharBoxs(finalLineIsEmpty)).to.equal(finalLineIsEmptyText)
    expect(textFromCharBoxs(oneLine)).to.equal(oneLineText)
    expect(textFromCharBoxs(multiLine)).to.equal(multiLineText)
  })

  it("genTextChar", () => {
    expect(genTextChar(firstLineIsEmptyText)).to.deep.equal(textCharFromTextBox(firstLineIsEmpty))
    expect(genTextChar(finalLineIsEmptyText)).to.deep.equal(textCharFromTextBox(finalLineIsEmpty))
    expect(genTextChar(oneLineText)).to.deep.equal(textCharFromTextBox(oneLine))
    expect(genTextChar(multiLineText)).to.deep.equal(textCharFromTextBox(multiLine))
  })
})
