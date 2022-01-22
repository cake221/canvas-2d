export function invariant(condition: any, message?: string): asserts condition {
  if (condition) {
    return
  }

  throw new Error("Invariant failed: " + (message || ""))
}

export function assertNever(x: never, message?: ""): never {
  throw new Error("Unexpected object: " + x + "\n" + message)
}

type Type = "object" | "array" | "number" | "string" | "boolean" | "null"
type JsonType = Array<any> | Record<string, any> | number | string | boolean | null

export function assertJsonType(value?: JsonType, type?: Type) {
  if (value === undefined || type === undefined) return
  switch (type) {
    case "array":
      if (!Array.isArray(value)) {
        throw new Error(`${value} 不是 ${type} 类型`)
      }
      return
    case "object":
    case "number":
    case "string":
    case "boolean":
    case "null":
      if (typeof value !== type) throw new Error(`${value} 不是 ${type} 类型`)
      return
    default:
      assertNever(type)
  }
}

export function assetValueRange(value?: any, range?: any[]) {
  if (value === undefined || range === undefined) return
  if (range.includes(value)) return
  throw new Error(`${value} 不属于 ${range}`)
}
