import { expect } from "chai"
import { parseString } from "../src/parseValue"

describe("parseValue", () => {
  context("parseString", () => {
    it("数字", () => {
      expect(parseString("123")).to.eq(123)
      expect(parseString("'123'")).to.eq("123")
      expect(parseString("[1,2,3]")).to.deep.eq([1, 2, 3])
      expect(parseString("{1: 1,2: 2,3: 3}")).to.deep.eq({ 1: 1, 2: 2, 3: 3 })
    })
  })
})
