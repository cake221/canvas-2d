/// <reference types="cypress" />

describe("文本输入：", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/lib/canvas-input/_demos/index.html")
  })

  it("文本输入存在一个canvas元素", () => {
    cy.get("canvas")
      .should("have.length", 1)
      .toMatchImageSnapshot()
  })

  context("测试点击行为", () => {
    it("点击canvas出现光标", () => {
      cy.get("canvas")
        .click(10, 10)
        .toMatchImageSnapshot({
          delay: 10
        })
      cy.get("canvas")
        .click(10, 10)
        .then(($el) => {
          $el.toMatchImageSnapshot()
        })
    })
  })

  context("测试输入行为", () => {
    it("输入一个 input 字符", () => {
      cy.get("canvas")
        .type("input")
        .toMatchImageSnapshot()
    })
  })

  context("测试选区行为", () => {})
})
